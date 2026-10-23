package techlab.fenixia.dto;

import java.util.List;

public class CrearPedidoRequest {
    private String nombreC;
    private List<ItemPedidoRequest> items;

    public CrearPedidoRequest(){

    }
    public String getNombreC(){
        return nombreC;
    }
    public void setNombreC(String nombreC){
        this.nombreC = nombreC;
    }
    public List<ItemPedidoRequest> getItems(){
        return items;
    }
    public void setItems(List<ItemPedidoRequest>items){
        this.items = items;
    }
    public static class ItemPedidoRequest{
        private Long productoId;
        private int cantidad;

        public ItemPedidoRequest(){}
        public Long getProductoId(){return productoId;}
        public void setProductoId(Long productoId){this.productoId = productoId;}
        public int getCantidad(){return cantidad;}
        public void setCantidad(int cantidad){this.cantidad = cantidad;}
    }
}
