package com.Les.Portal_Leitura.controllers;

import com.Les.Portal_Leitura.domain.cliente.ItemPedido;
import com.Les.Portal_Leitura.domain.cliente.Pedido;
import com.Les.Portal_Leitura.domain.cliente.StatusPedido;
import com.Les.Portal_Leitura.dto.PedidoAdminResponseDto;
import com.Les.Portal_Leitura.repository.CupomRepository;
import com.Les.Portal_Leitura.repository.PedidoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.Les.Portal_Leitura.dto.ItemDto;

import java.util.List;

@RestController
@RequestMapping("/admin/pedidos")
public class AdminVendaController {

    @Autowired
    private CupomRepository cupomRepository;

    @Autowired
    private PedidoRepository pedidoRepository;

    @PutMapping("/{id}/aprovar")
    public ResponseEntity<?> aprovar(@PathVariable Long id) {
        Pedido pedido = pedidoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Pedido não encontrado"));

        if (pedido.getStatus() != StatusPedido.AGUARDANDO_APROVACAO) {
            throw new RuntimeException("Pedido não está aguardando aprovação");
        }

        pedido.setStatus(StatusPedido.APROVADO);
        pedidoRepository.save(pedido);

        return ResponseEntity.ok().build();
    }

    @PutMapping("/{id}/recusar")
    public ResponseEntity<?> recusar(@PathVariable Long id) {
        Pedido pedido = pedidoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Pedido não encontrado"));

        pedido.setStatus(StatusPedido.RECUSADO);
        pedidoRepository.save(pedido);

        return ResponseEntity.ok().build();
    }

    @PutMapping("/{id}/despachar")
    public ResponseEntity<?> despachar(@PathVariable Long id) {
        Pedido pedido = pedidoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Pedido não encontrado"));


        pedido.setStatus(StatusPedido.DESPACHADO);
        pedidoRepository.save(pedido);

        return ResponseEntity.ok().build();
    }


    @GetMapping
    public List<PedidoAdminResponseDto> listar() {
        List<Pedido> pedidos = pedidoRepository.findAll();

        return pedidos.stream().map(pedido -> {
            PedidoAdminResponseDto dto = new PedidoAdminResponseDto();

            dto.setId(pedido.getId());
            dto.setNomeCliente(pedido.getCliente().getNome());
            dto.setStatus(pedido.getStatus().name());
            dto.setEnderecoEntrega(
                    pedido.getRua() + ", " +
                            pedido.getCidade() + " - " +
                            pedido.getEstado() + " | CEP: " +
                            pedido.getCep()
            );

            dto.setItens(
                    pedido.getItens().stream()
                            .map(item -> ItemDto.builder()

                                    .nomeLivro(item.getNomeLivro())

                                    .preco(item.getPreco())

                                    .quantidade(item.getQuantidade())

                                    .imagem(item.getImagem())

                                    .cupomTroca(
                                            item.getCupomTroca() != null
                                                    ? item.getCupomTroca().getCodigo()
                                                    : null
                                    )

                                    .cupomTrocaAprovado(
                                            item.isCupomTrocaAprovado()
                                    )

                                    .build())
                            .toList()
            );


            if (pedido.getCupom() != null) {
                dto.setCupom(pedido.getCupom().getCodigo());
                dto.setCupomAprovado(pedido.getCupom().isAprovado());
            } else {
                dto.setCupom("Sem cupom");
                dto.setCupomAprovado(true);
            }

            // 🔄 NOVO: Mapeamento do Cupom de Troca (Para enviar ao Frontend)
            if (pedido.getCupomTroca() != null) {
                dto.setCupomTroca(pedido.getCupomTroca().getCodigo());
                dto.setCupomTrocaAprovado(pedido.getCupomTroca().isAprovado());
            } else {
                dto.setCupomTroca("Sem cupom");
                dto.setCupomTrocaAprovado(true);
            }

            dto.setData(pedido.getData());

            return dto;
        }).toList();
    }


    @PutMapping("/{id}/aprovar-cupom")
    public ResponseEntity<?> aprovarCupom(@PathVariable Long id) {

        Pedido pedido = pedidoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Pedido não encontrado"));

        boolean encontrouCupom = false;

        for (ItemPedido item : pedido.getItens()) {

            if (item.getCupomTroca() != null) {

                encontrouCupom = true;

                item.setCupomTrocaAprovado(true);

                item.getCupomTroca().setAprovado(true);

                cupomRepository.save(item.getCupomTroca());
            }
        }

        if (!encontrouCupom) {
            throw new RuntimeException(
                    "Nenhum item possui cupom de troca"
            );
        }

        pedido.setCupomTrocaAprovado(true);

        pedido.setStatus(StatusPedido.APROVADO);

        pedidoRepository.save(pedido);

        return ResponseEntity.ok().build();
    }

    @PutMapping("/{id}/recusar-cupom")
    public ResponseEntity<?> recusarCupom(@PathVariable Long id) {

        Pedido pedido = pedidoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Pedido não encontrado"));

        boolean encontrouCupom = false;

        for (ItemPedido item : pedido.getItens()) {

            if (item.getCupomTroca() != null) {

                encontrouCupom = true;

                item.setCupomTrocaAprovado(false);

                item.getCupomTroca().setAprovado(false);

                item.getCupomTroca().setAtivo(false);

                cupomRepository.save(item.getCupomTroca());
            }
        }

        if (!encontrouCupom) {
            throw new RuntimeException(
                    "Nenhum item possui cupom de troca"
            );
        }

        pedido.setCupomTrocaAprovado(false);

        pedidoRepository.save(pedido);

        return ResponseEntity.ok().build();
    }

    @PutMapping("/{id}/entregar")
    public ResponseEntity<?> entregar(@PathVariable Long id) {
        Pedido pedido = pedidoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Pedido não encontrado"));

        if (pedido.getStatus() != StatusPedido.DESPACHADO) {
            throw new RuntimeException("O pedido precisa estar em transporte para ser entregue");
        }

        pedido.setStatus(StatusPedido.FINALIZADO);
        pedidoRepository.save(pedido);

        return ResponseEntity.ok().build();
    }
}