package techlab.fenixia.service;

import org.springframework.stereotype.Service;
import techlab.fenixia.repository.PedidoRepository;
import techlab.fenixia.repository.DetallePedidoRepository;

@Service
public class PedidoService {

    private final PedidoRepository pedidoRepository;
    private final DetallePedidoRepository detallePedidoRepository;

    public PedidoService(
            PedidoRepository pedidoRepository,
            DetallePedidoRepository detallePedidoRepository) {
        this.pedidoRepository = pedidoRepository;
        this.detallePedidoRepository = detallePedidoRepository;
    }
}