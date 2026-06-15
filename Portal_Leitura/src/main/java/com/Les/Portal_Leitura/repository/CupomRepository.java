package com.Les.Portal_Leitura.repository;


import com.Les.Portal_Leitura.domain.cliente.Cupom;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface CupomRepository extends JpaRepository<Cupom, Long> {
    Optional<Cupom> findByCodigo(String codigo);

}
