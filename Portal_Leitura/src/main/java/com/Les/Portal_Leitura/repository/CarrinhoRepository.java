package com.Les.Portal_Leitura.repository;

import com.Les.Portal_Leitura.domain.cliente.Carrinho;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface CarrinhoRepository extends JpaRepository<Carrinho, Long> {

    Optional<Carrinho> findTopByClienteIdOrderByIdDesc(Long clienteId);
}
