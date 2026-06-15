package com.Les.Portal_Leitura.repository;

import com.Les.Portal_Leitura.domain.cliente.ItemPedido;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;


@Repository
public interface ItemPedidoRepository extends JpaRepository<ItemPedido, Long> {

    List<ItemPedido> findByPedidoId(Long pedidoId);

    void deleteByPedidoId(Long pedidoId);
}