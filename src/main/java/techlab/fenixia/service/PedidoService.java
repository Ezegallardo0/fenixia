package techlab.fenixia.service;

import java.util.ArrayList;
import java.util.List;

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
    public Pedido crearPedido(CrearPedidoRequest request) {
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
        return pedidoRepository.save(pedido);
    }
}