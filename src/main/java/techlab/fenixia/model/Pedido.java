package techlab.fenixia.model;

import jakarta.persistence.GenerationType;

import java.time.LocalDateTime;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.PrePersist;

@Entity 
public class Pedido {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String nombreC;
    private LocalDateTime fecha;
    private String estado;
    private double total;

    public Pedido(){
    }
    public Pedido(String nombreC){
        this.nombreC = nombreC;
        this.estado= "PENDIENTE";
        this.total = 0;
    }
    @PrePersist
    public void antesDeGuardar(){
        if(fecha == null){
            fecha = LocalDateTime.now();
        }
        if(estado== null){
            estado = "PENDIENTE";
        }
    }
    public Long getId(){
        return id;
    }
    public String getNombreC(){
        return nombreC;
    }
    public void setNombreC(String nombreC){
        this.nombreC = nombreC;
    }
    public LocalDateTime getFecha(){
        return fecha;
    }
    public String getEstado(){
        return estado;
    }
    public double getTotal(){
        return total;
    }
    public void setTotal(Double total){
        this.total = total;
    }
}
