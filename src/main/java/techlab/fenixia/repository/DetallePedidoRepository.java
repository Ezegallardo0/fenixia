package techlab.fenixia.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import techlab.fenixia.model.DetallePedido;
import java.util.List;


public interface DetallePedidoRepository extends JpaRepository<DetallePedido, Long>{

    List<DetallePedido> findByPedidoId(Long pedido);
    
}
