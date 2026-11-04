package techlab.fenixia.model;

import java.time.LocalDateTime;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToOne;

@Entity 
public class MovimientoStock {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String tipo;
    private int cantidad;
    private LocalDateTime fecha;

    @ManyToOne
    private Producto producto;

    public MovimientoStock(){

    }

    public MovimientoStock(String tipo, int cantidad, Producto producto) {
        this(tipo, cantidad, producto, LocalDateTime.now());
    }

    public MovimientoStock(String tipo, int cantidad, Producto producto, LocalDateTime fecha){
        this.tipo = tipo;
        this.cantidad = cantidad;
        this.producto = producto;
        this.fecha = fecha != null ? fecha : LocalDateTime.now();
    }
    public Long getId(){
        return id;
    }
    public String getTipo(){
        return tipo;
    }
    public int getCantidad(){
        return cantidad;
    }
    public LocalDateTime getFecha(){
        return fecha;
    }
    public Producto getProducto(){
        return producto;
    }
}
