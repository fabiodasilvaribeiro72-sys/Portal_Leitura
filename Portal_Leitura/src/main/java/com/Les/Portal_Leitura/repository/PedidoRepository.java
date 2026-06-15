package com.Les.Portal_Leitura.repository;

import com.Les.Portal_Leitura.domain.cliente.Pedido;
import com.Les.Portal_Leitura.domain.cliente.StatusPedido;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;


@Repository
public interface PedidoRepository extends JpaRepository<Pedido, Long> {

    Optional<Pedido> findByCliente_IdAndStatus(Long clienteId, StatusPedido status);

    List<Pedido> findByCliente_Id(Long clienteId);

}


