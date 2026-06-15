package com.Les.Portal_Leitura.service;

import com.Les.Portal_Leitura.domain.cliente.*;
import com.Les.Portal_Leitura.dto.CheckoutRequestDTO;
import com.Les.Portal_Leitura.dto.ItemDto;
import com.Les.Portal_Leitura.dto.PagamentoDto;
import com.Les.Portal_Leitura.repository.CarrinhoRepository;
import com.Les.Portal_Leitura.repository.ClienteRepository;
import com.Les.Portal_Leitura.repository.CupomRepository;
import com.Les.Portal_Leitura.repository.PedidoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
public class PedidoService {

    @Autowired
    private PedidoRepository pedidoRepository;

    @Autowired
    private ClienteRepository clienteRepository;

    @Autowired
    private FreteService freteService;

    @Autowired
    private CupomService cupomService;

    @Autowired
    private CupomRepository cupomRepository;

    @Autowired
    private PagamentoService pagamentoService;

    @Autowired
    private CarrinhoRepository carrinhoRepository;

    @Autowired
    private Troca trocacupom;

    public Pedido finalizarPedido(CheckoutRequestDTO dto) {

        Cliente cliente = clienteRepository.findById(dto.getClienteId())
                .orElseThrow(() ->
                        new RuntimeException("Cliente não encontrado"));

        Carrinho carrinho = carrinhoRepository
                .findTopByClienteIdOrderByIdDesc(dto.getClienteId())
                .orElseThrow(() ->
                        new RuntimeException("Carrinho vazio"));

        if (carrinho.getItens() == null ||
                carrinho.getItens().isEmpty()) {

            throw new RuntimeException("Carrinho vazio");
        }

        Pedido pedido = new Pedido();

        pedido.setCliente(cliente);

        pedido.setCep(dto.getCep());
        pedido.setRua(dto.getRua());
        pedido.setCidade(dto.getCidade());
        pedido.setEstado(dto.getEstado());

        pedido.setStatus(StatusPedido.PROCESSANDO);

        String cep = dto.getCep();

        if (cep == null || cep.isBlank()) {
            throw new RuntimeException("CEP não informado");
        }

        double frete =
                freteService.calcularFrete(cep);

        Cupom cupom = null;

        if (dto.getCupom() != null &&
                !dto.getCupom().isBlank()) {

            cupom = cupomRepository
                    .findByCodigo(dto.getCupom())
                    .orElseThrow(() ->
                            new RuntimeException(
                                    "Cupom não encontrado"));

            if (!cupom.isAprovado()) {

                throw new RuntimeException(
                        "Cupom não aprovado pelo admin");
            }
        }

        pedido.setCupom(cupom);

        List<ItemPedido> itens = new ArrayList<>();

        for (int idx = 0;
             idx < carrinho.getItens().size();
             idx++) {

            var itemCarrinho =
                    carrinho.getItens().get(idx);

            ItemPedido itemPedido =
                    new ItemPedido();

            itemPedido.setNomeLivro(
                    itemCarrinho.getNomeLivro());

            itemPedido.setPreco(
                    itemCarrinho.getPreco());

            itemPedido.setQuantidade(
                    itemCarrinho.getQuantidade());

            itemPedido.setImagem(
                    itemCarrinho.getImagem());

            itemPedido.setPedido(pedido);

            if (dto.getItens() != null &&
                    dto.getItens().size() > idx) {

                ItemDto itemDto =
                        dto.getItens().get(idx);

                if (itemDto.getCupomTroca() != null &&
                        !itemDto.getCupomTroca().isBlank()) {

                    String codigoTroca =
                            itemDto.getCupomTroca()
                                    .trim()
                                    .toUpperCase();

                    Cupom cupomTroca;

                    if ("TROCA20".equals(codigoTroca)) {

                        cupomTroca =
                                cupomRepository
                                        .findByCodigo(codigoTroca)
                                        .orElseGet(() -> {

                                            Cupom novo =
                                                    new Cupom();

                                            novo.setCodigo(
                                                    codigoTroca);

                                            novo.setAprovado(false);

                                            novo.setAtivo(true);

                                            novo.setPermiteTroca(true);

                                            novo.setDesconto(0.0);

                                            return cupomRepository
                                                    .save(novo);
                                        });

                    } else {

                        cupomTroca =
                                cupomRepository
                                        .findByCodigo(codigoTroca)
                                        .orElseThrow(() ->
                                                new RuntimeException(
                                                        "Cupom de troca não encontrado"));

                        if (!cupomTroca.isAprovado()) {

                            throw new RuntimeException(
                                    "Cupom de troca não aprovado");
                        }

                        if (!trocacupom.podeTrocar(cupomTroca)) {

                            throw new RuntimeException(
                                    "Cupom não permite troca");
                        }
                    }

                    itemPedido.setCupomTroca(cupomTroca);

                    itemPedido.setCupomTrocaAprovado(false);
                }
            }

            itens.add(itemPedido);
        }

        pedido.setItens(itens);

        double subtotal = itens.stream()
                .mapToDouble(i ->
                        i.getPreco() * i.getQuantidade())
                .sum();

        double subtotalComDesconto =
                cupomService.aplicar(
                        cupom != null
                                ? cupom.getCodigo()
                                : null,
                        subtotal
                );

        double total =
                subtotalComDesconto + frete;

        total =
                Math.round(total * 100.0) / 100.0;

        System.out.println(
                "------ DEBUG PEDIDO ------");

        System.out.println(
                "Subtotal: " + subtotal);

        System.out.println(
                "Frete: " + frete);

        System.out.println(
                "Cupom: " +
                        (cupom != null
                                ? cupom.getCodigo()
                                : "null"));

        System.out.println(
                "TOTAL FINAL: " + total);

        System.out.println(
                "--------------------------");

        if (dto.getPagamentos() == null ||
                dto.getPagamentos().isEmpty()) {

            throw new RuntimeException(
                    "Nenhum pagamento informado");
        }

        for (PagamentoDto pagamento :
                dto.getPagamentos()) {

            if (pagamento.getValor() < 10) {

                throw new RuntimeException(
                        "Cada cartão deve ter valor mínimo de R$ 10");
            }
        }

        pagamentoService.processarPagamentos(
                dto.getPagamentos(),
                cliente,
                pedido,
                total
        );

        pedido.setStatus(
                StatusPedido.AGUARDANDO_APROVACAO);

        pedido.setValorTotal(total);

        pedido.setData(
                LocalDateTime.now());

        Pedido pedidoSalvo =
                pedidoRepository.save(pedido);

        carrinho.getItens().clear();

        carrinhoRepository.save(carrinho);

        return pedidoSalvo;
    }

    public List<Pedido> buscarPorCliente(Long clienteId) {
        return pedidoRepository.findByCliente_Id(clienteId);
    }
}