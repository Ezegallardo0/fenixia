package techlab.fenixia.dto;

import java.time.LocalDateTime;

public class PedidoResponse {
    private Long id;
    private String nombreCliente;
    private LocalDateTime fecha;
    private String estado;
    private double total;

    public PedidoResponse(
        Long id,
        String nombreCliente,
        LocalDateTime fecha,
        String estado,
        double total){
            this.id = id;
            this.nombreCliente = nombreCliente;
            this.fecha = fecha;
            this.estado = estado;
            this.total = total;
        }
        public Long getId() {
        return id;
    }

    public String getNombreCliente() {
        return nombreCliente;
    }

    public LocalDateTime getFecha() {
        return fecha;
    }

    public String getEstado() {
        return estado;
    }

    public double getTotal() {
        return total;
    }

}
