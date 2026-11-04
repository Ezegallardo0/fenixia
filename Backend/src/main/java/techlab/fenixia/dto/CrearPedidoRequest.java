package techlab.fenixia.dto;

import java.util.List;

public class CrearPedidoRequest {
    private String nombreCliente;
    private List<ItemPedidoRequest> items;

    public CrearPedidoRequest() {

    }

    public String getNombreCliente() {
        return nombreCliente;
    }

    public void setNombreCliente(String nombreCliente) {
        this.nombreCliente = nombreCliente;
    }

    public List<ItemPedidoRequest> getItems() {
        return items;
    }

    public void setItems(List<ItemPedidoRequest> items) {
        this.items = items;
    }

    public static class ItemPedidoRequest {
        private Long productoId;
        private int cantidad;

        public ItemPedidoRequest() {
        }

        public Long getProductoId() {
            return productoId;
        }

        public void setProductoId(Long productoId) {
            this.productoId = productoId;
        }

        public int getCantidad() {
            return cantidad;
        }

        public void setCantidad(int cantidad) {
            this.cantidad = cantidad;
        }
    }
}
