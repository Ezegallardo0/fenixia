
package techlab.fenixia.controller;

import java.util.List;
import java.util.Map;

import org.springframework.web.bind.annotation.*;

import techlab.fenixia.dto.CrearPedidoRequest;
import techlab.fenixia.dto.PedidoResponse;
import techlab.fenixia.dto.DetallePedidoResponse;
import techlab.fenixia.service.PedidoService;

@RestController
@RequestMapping("/api/pedidos")
public class PedidoController {

    private final PedidoService pedidoService;

    public PedidoController(PedidoService pedidoService) {
        this.pedidoService = pedidoService;
    }

    @PostMapping
    public PedidoResponse crearPedido(
            @RequestBody CrearPedidoRequest request) {
        return pedidoService.crearPedido(request);
    }

    @GetMapping
    public List<PedidoResponse> listarPedidos() {
        return pedidoService.listarPedidos();
    }

    @GetMapping("/{id}")
    public PedidoResponse buscarPedido(@PathVariable Long id) {
        return pedidoService.obtenerPedido(id);
    }

    @GetMapping("/{id}/detalles")
    public List<DetallePedidoResponse> listarDetalles(
            @PathVariable Long id) {
        return pedidoService.listarDetalles(id);
    }

    @PatchMapping("/{id}/estado")
    public PedidoResponse actualizarEstado(
            @PathVariable Long id,
            @RequestBody Map<String, String> body) {
        return pedidoService.actualizarEstado(
                id, body.get("estado"));
    }

    @DeleteMapping("/{id}/cancelar")
    public PedidoResponse cancelarPedido(@PathVariable Long id) {
        return pedidoService.cancelarPedido(id);
    }
}
