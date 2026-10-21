package techlab.fenixia.service;

import java.util.List;
import org.springframework.stereotype.Service;
import techlab.fenixia.model.Producto;
import techlab.fenixia.repository.ProductoRepository;

@Service
public class ProductoService {
    private final ProductoRepository productoRepository;

    public ProductoService(ProductoRepository productoRepository) {
        this.productoRepository = productoRepository;
    }

    public List<Producto> listarProducto() {
        return productoRepository.findAll();
    }

    public Producto buscaProducto(Long id) {
        return productoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Producto no encontrado."));
    }

    public Producto crearProducto(Producto producto) {
        return productoRepository.save(producto);
    }

    public Producto actualizarProducto(Long id, Producto productoActualizado) {
        Producto producto = buscaProducto(id);

        producto.setNombre(productoActualizado.getNombre());
        producto.setPrecio(productoActualizado.getPrecio());
        producto.setStock(productoActualizado.getStock());

        return productoRepository.save(producto);
    }

    public void eliminarProducto(Long id) {
        Producto producto = buscaProducto(id);
        productoRepository.delete(producto);
    }
}
