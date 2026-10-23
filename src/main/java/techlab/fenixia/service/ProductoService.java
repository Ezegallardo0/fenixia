package techlab.fenixia.service;

import java.util.List;
import techlab.fenixia.util.Validador;
import org.springframework.stereotype.Service;
import techlab.fenixia.model.MovimientoStock;
import techlab.fenixia.repository.MovimientoStockRepository;
import techlab.fenixia.exception.RecursoNoEncontrado;
import techlab.fenixia.model.Producto;
import techlab.fenixia.repository.ProductoRepository;

@Service
public class ProductoService {
    private final ProductoRepository productoRepository;
    private final MovimientoStockRepository movimientoStockRepository;

    public ProductoService(ProductoRepository productoRepository, MovimientoStockRepository movimientoStockRepository) {
        this.productoRepository = productoRepository;
        this.movimientoStockRepository = movimientoStockRepository;
    }

    public List<Producto> listarProductos() {
        return productoRepository.findAll();
    }

    public Producto buscaProducto(Long id) {
        return productoRepository.findById(id)
                .orElseThrow(() -> new RecursoNoEncontrado("No existe un producto con el ID" + id));
    }

    public Producto crearProducto(Producto producto) {
        Validador.validarProductos(
                producto.getNombre(),
                producto.getPrecio(),
                producto.getStock());
        return productoRepository.save(producto);
    }

    public Producto actualizarProducto(Long id, Producto productoActualizado) {
        Producto producto = buscaProducto(id);
        Validador.validarProductos(
                producto.getNombre(),
                producto.getPrecio(),
                producto.getStock());
        producto.setNombre(productoActualizado.getNombre());
        producto.setPrecio(productoActualizado.getPrecio());
        producto.setStock(productoActualizado.getStock());

        return productoRepository.save(producto);
    }

    public Producto actualizarStock(Long id, int cantidad) {
        Producto producto = buscaProducto(id);
        if (cantidad == 0) {
            throw new IllegalArgumentException("La cantidad del movimiento no puede ser cero");
        }
        int nuevoStock = producto.getStock() + cantidad;
        if (nuevoStock < 0) {
            throw new IllegalArgumentException("No hay stock suficiente para realizar la operacion");
        }
        producto.setStock(nuevoStock);
        Producto productoGuardado = productoRepository.save(producto);
        String tipo = cantidad > 0 ? "ENTRADA" : "SALIDA";

        MovimientoStock movimiento = new MovimientoStock(
                tipo,
                Math.abs(cantidad),
                productoGuardado);
        movimientoStockRepository.save(movimiento);
        return productoGuardado;
    }

    public void eliminarProducto(Long id) {
        Producto producto = buscaProducto(id);
        productoRepository.delete(producto);
    }
}
