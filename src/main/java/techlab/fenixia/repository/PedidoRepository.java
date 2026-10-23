package techlab.fenixia.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import techlab.fenixia.model.Pedido;

public interface PedidoRepository extends JpaRepository<Pedido, Long> {
    
}
