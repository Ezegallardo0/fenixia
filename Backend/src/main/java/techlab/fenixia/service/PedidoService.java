package techlab.fenixia.service;

import java.util.ArrayList;
import java.util.List;
import java.util.Locale;
import java.util.Set;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import techlab.fenixia.dto.CrearPedidoRequest;
import techlab.fenixia.dto.CrearPedidoRequest.ItemPedidoRequest;
import techlab.fenixia.exception.RecursoNoEncontrado;
import techlab.fenixia.model.DetallePedido;
import techlab.fenixia.model.MovimientoStock;
import techlab.fenixia.model.Pedido;
import techlab.fenixia.model.Producto;
import techlab.fenixia.repository.DetallePedidoRepository;
import techlab.fenixia.repository.MovimientoStockRepository;
import techlab.fenixia.repository.PedidoRepository;
import techlab.fenixia.repository.ProductoRepository;
import techlab.fenixia.dto.PedidoResponse;
import techlab.fenixia.dto.DetallePedidoResponse;

@Service
public class PedidoService {

    private final PedidoRepository pedidoRepository;
    private final DetallePedidoRepository detallePedidoRepository;
    private final ProductoRepository productoRepository;
    private final MovimientoStockRepository movimientoStockRepository;

    public PedidoService(
            PedidoRepository pedidoRepository,
            DetallePedidoRepository detallePedidoRepository,
            ProductoRepository productoRepository,
            MovimientoStockRepository movimientoStockRepository) {
        this.pedidoRepository = pedidoRepository;
        this.detallePedidoRepository = detallePedidoRepository;
        this.productoRepository = productoRepository;
        this.movimientoStockRepository = movimientoStockRepository;
    }

    @Transactional
    public PedidoResponse crearPedido(CrearPedidoRequest request) {
        if (request == null
                || request.getNombreC() == null
                || request.getNombreC().isBlank()) {
            throw new IllegalArgumentException("El nombre del cliente es obligatorio.");
        }

        if (request.getItems() == null || request.getItems().isEmpty()) {
            throw new IllegalArgumentException("El pedido debe contener al menos un producto.");
        }

        List<Producto> productos = new ArrayList<>();
        for (ItemPedidoRequest item : request.getItems()) {

            if (item == null || item.getProductoId() == null) {
                throw new IllegalArgumentException("Cada articulo debe tener un ID de producto.");
            }

            if (item.getCantidad() <= 0) {
                throw new IllegalArgumentException("La cantidad debe ser mayor que 0.");
            }

            Producto producto = productoRepository
                    .findById(item.getProductoId())
                    .orElseThrow(
                            () -> new RecursoNoEncontrado("No existe el producto con id: " + item.getProductoId()));

            if (producto.getStock() < item.getCantidad()) {
                throw new IllegalArgumentException("Stock insuficiente para " + producto.getNombre());
            }
            productos.add(producto);
        }

        Pedido pedido = new Pedido(request.getNombreC());
        pedido = pedidoRepository.save(pedido);
        double total = 0;

        for (int i = 0; i < request.getItems().size(); i++) {
            ItemPedidoRequest item = request.getItems().get(i);
            Producto producto = productos.get(i);
            double precioUni = producto.getPrecio();

            DetallePedido detalle = new DetallePedido(pedido, producto, item.getCantidad(), precioUni);
            detallePedidoRepository.save(detalle);
            total += precioUni * item.getCantidad();
            producto.setStock(producto.getStock() - item.getCantidad());
            productoRepository.save(producto);

            MovimientoStock movimiento = new MovimientoStock("SALIDA", item.getCantidad(), producto);
            movimientoStockRepository.save(movimiento);
        }

        pedido.setTotal(total);
        return convertirPedido(pedidoRepository.save(pedido));
    }

    public PedidoResponse actualizarEstado(Long id, String nuevoEstado) {

        Pedido pedido = buscarPedido(id);

        if (nuevoEstado == null || nuevoEstado.isBlank()) {
            throw new IllegalArgumentException(
                    "El estado no puede estar vacío");
        }

        nuevoEstado = nuevoEstado.toUpperCase().trim();

        String estadoActual = pedido.getEstado();

        if (nuevoEstado.equals("CANCELADO")) {
            throw new IllegalArgumentException(
                    "Para cancelar un pedido utilizá el endpoint de cancelación");
        }

        if (estadoActual.equals("CANCELADO")
                || estadoActual.equals("COMPLETADO")) {
            throw new IllegalArgumentException(
                    "No se puede modificar un pedido en estado "
                            + estadoActual);
        }

        if (estadoActual.equals("PENDIENTE")
                && !nuevoEstado.equals("CONFIRMADO")) {
            throw new IllegalArgumentException(
                    "Un pedido pendiente solamente puede confirmarse o cancelarse");
        }

        if (estadoActual.equals("CONFIRMADO")
                && !nuevoEstado.equals("COMPLETADO")) {
            throw new IllegalArgumentException(
                    "Un pedido confirmado solamente puede completarse o cancelarse");
        }

        pedido.setEstado(nuevoEstado);

        return convertirPedido(pedidoRepository.save(pedido));
    }

    @Transactional
    public PedidoResponse cancelarPedido(Long id) {
        Pedido pedido = buscarPedido(id);
        if (pedido.getEstado().equals("CANCELADO")) {
            throw new IllegalArgumentException("El pedido ya se encuentra cancelado.");
        }
        if (pedido.getEstado().equals("COMPLETADO")) {
            throw new IllegalArgumentException(
                    "No se puede cancelar un pedido completado");
        }
        List<DetallePedido> detalles = detallePedidoRepository.findByPedidoId(id);

        for (DetallePedido detalle : detalles) {
            Producto producto = detalle.getProducto();

            producto.setStock(
                    producto.getStock() + detalle.getCantidad());
            productoRepository.save(producto);

            MovimientoStock movimiento = new MovimientoStock(
                    "ENTRADA",
                    detalle.getCantidad(),
                    producto);
            movimientoStockRepository.save(movimiento);
        }
        pedido.setEstado("CANCELADO");
        return convertirPedido(pedidoRepository.save(pedido));
    }

    private Pedido buscarPedido(Long id) {
        return pedidoRepository.findById(id)
                .orElseThrow(() -> new RecursoNoEncontrado("No existe un pedido con el ID " + id));
    }

    public PedidoResponse convertirPedido(Pedido pedido) {
        return new PedidoResponse(
                pedido.getId(),
                pedido.getNombreCliente(),
                pedido.getFecha(),
                pedido.getEstado(),
                pedido.getTotal());
    }

    public DetallePedidoResponse convertirDetalle(DetallePedido detalle) {
        return new DetallePedidoResponse(
                detalle.getId(),
                detalle.getProducto().getId(),
                detalle.getProducto().getNombre(),
                detalle.getCantidad(),
                detalle.getPrecioUnitario());
    }

    public List<PedidoResponse> listarPedidos() {

        return pedidoRepository.findAll()
                .stream()
                .map(this::convertirPedido)
                .toList();
    }

    public PedidoResponse obtenerPedido(Long id) {

        Pedido pedido = buscarPedido(id);

        return convertirPedido(pedido);
    }

    public List<DetallePedidoResponse> listarDetalles(Long pedidoId) {

        buscarPedido(pedidoId);

        return detallePedidoRepository.findByPedidoId(pedidoId)
                .stream()
                .map(this::convertirDetalle)
                .toList();
    }
}