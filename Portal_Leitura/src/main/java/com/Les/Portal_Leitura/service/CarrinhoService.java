package com.Les.Portal_Leitura.service;

import com.Les.Portal_Leitura.domain.cliente.*;
import com.Les.Portal_Leitura.dto.CarrinhoDto;
import com.Les.Portal_Leitura.dto.ItemDto;
import com.Les.Portal_Leitura.repository.*;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CarrinhoService {

    @Autowired
    private PedidoRepository pedidoRepository;

    @Autowired
    private ItemPedidoRepository itemRepository;

    @Autowired
    private ClienteRepository clienteRepository;

    public Pedido salvarComoCarrinho(CarrinhoDto dto) {

        Cliente cliente = clienteRepository.findById(dto.getClienteId()).orElseThrow();

        Pedido pedido = pedidoRepository
                .findByCliente_IdAndStatus(cliente.getId(), StatusPedido.CARRINHO)
                .orElseGet(() -> {
                    Pedido novo = new Pedido();
                    novo.setCliente(cliente);
                    novo.setStatus(StatusPedido.CARRINHO);
                    return pedidoRepository.save(novo);
                });

        // limpa itens antigos
        itemRepository.deleteByPedidoId(pedido.getId());

        List<ItemPedido> itens = dto.getItens().stream().map(i -> {
            ItemPedido item = new ItemPedido();
            item.setNomeLivro(i.getNomeLivro()); // ✅ corrigido
            item.setPreco(i.getPreco());
            item.setQuantidade(i.getQuantidade());
            item.setPedido(pedido);
            return item;
        }).toList();

        itemRepository.saveAll(itens);

        pedido.setItens(itens);

        return pedido;
    }

    public CarrinhoDto buscarCarrinhoCompleto(Long clienteId) {

        Pedido pedido = pedidoRepository
                .findByCliente_IdAndStatus(clienteId, StatusPedido.CARRINHO)
                .orElse(null);

        if (pedido == null) return null;

        CarrinhoDto dto = new CarrinhoDto();
        dto.setClienteId(clienteId);

        List<ItemDto> itens = pedido.getItens().stream().map(i -> {
            ItemDto item = new ItemDto();
            item.setNomeLivro(i.getNomeLivro()); //
            item.setPreco(i.getPreco());
            item.setQuantidade(i.getQuantidade());
            return item;
        }).toList();

        dto.setItens(itens);

        return dto;
    }
}