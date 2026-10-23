package techlab.fenixia.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import techlab.fenixia.model.MovimientoStock;

public interface MovimientoStockRepository extends JpaRepository<MovimientoStock, Long>{
    List<MovimientoStock> findByProductoId(Long productoId);

    
} 
