package techlab.fenixia.model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;

@Entity 
public class DetallePedido {
    @Id 
    @GeneratedValue (strategy = GenerationType.IDENTITY)
    private Long id;

    private int cantidad;
    private double precioUni;

    @ManyToOne
    @JoinColumn(name = "producto_id", nullable = false)
    private Pedido pedido;
    
    @ManyToOne 
    @JoinColumn(name = "producti_id",  nullable = false)
    private Producto producto;
    public DetallePedido(){

    }

    public DetallePedido(
        Pedido pedido,
        Producto producto,
        int cantidad,
        double precioUni
    ){
        this.pedido = pedido;
        this.producto = producto;
        this.cantidad = cantidad;
        this.precioUni = precioUni;
    }
    public Long getId(){
        return id;
    }
    public int getCantidad(){
        return cantidad;
    }
    public void setCantidad(int cantidad){
        this.cantidad = cantidad;
    }
    public double getPrecioUni(){
        return precioUni;
    }
    public void setPrecioUni(double precioUni){
        this.precioUni = precioUni;
    }
    public Pedido getPedido(){
        return pedido;
    }
    public Producto getProducto(){
        return producto;
    }

}
