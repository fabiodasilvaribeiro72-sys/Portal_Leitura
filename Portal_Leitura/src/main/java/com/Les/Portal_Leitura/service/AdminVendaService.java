package com.Les.Portal_Leitura.service;

import com.Les.Portal_Leitura.domain.cliente.Pedido;
import com.Les.Portal_Leitura.repository.PedidoRepository;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.List;

public class AdminVendaService {

    @Autowired
    private PedidoRepository pedidoRepository;

    public List<Pedido> listarTodos() {
        return pedidoRepository.findAll();
    }

}
