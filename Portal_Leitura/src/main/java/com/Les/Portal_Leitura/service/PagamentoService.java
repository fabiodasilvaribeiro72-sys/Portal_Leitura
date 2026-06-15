package com.Les.Portal_Leitura.service;

import com.Les.Portal_Leitura.domain.cliente.Cartao;
import com.Les.Portal_Leitura.domain.cliente.Cliente;
import com.Les.Portal_Leitura.domain.cliente.PagamentoCartao;
import com.Les.Portal_Leitura.domain.cliente.Pedido;
import com.Les.Portal_Leitura.dto.PagamentoDto;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service

public class PagamentoService{

public  List<PagamentoCartao> processarPagamentos(
        List<PagamentoDto> pagamentosDTO,
        Cliente cliente,
        Pedido pedido,
        double total) {

    if (pagamentosDTO == null || pagamentosDTO.isEmpty()) {
        throw new RuntimeException("Nenhum pagamento informado");
    }

    List<PagamentoCartao> pagamentos = new ArrayList<>();

    double soma = 0;

    for (PagamentoDto p : pagamentosDTO) {

        System.out.println("DTO RECEBIDO:");
        System.out.println(p.getNumeroCartao());

        System.out.println("CARTÕES DO CLIENTE:");

        cliente.getCartoes().forEach(c ->
                System.out.println(c.getNumero())
        );

        Cartao cartao = cliente.getCartoes()
                .stream()
                .filter(c ->
                        c.getNumero()
                                .equals(p.getNumeroCartao()))
                .findFirst()
                .orElseThrow(() ->
                        new RuntimeException(
                                "Cartão não encontrado"
                        ));

        if (p.getValor() == null || p.getValor() < 10) {

            throw new RuntimeException(
                    "Valor mínimo por cartão é R$ 10"
            );
        }

        PagamentoCartao pagamento =
                new PagamentoCartao();

        pagamento.setNumeroCartao(
                cartao.getNumero()
        );

        pagamento.setValorPago(
                p.getValor()
        );

        pagamento.setPedido(pedido);

        pagamentos.add(pagamento);

        soma += p.getValor();
    }

    // 🔥 DEBUG
    System.out.println("TOTAL BACKEND: " + total);
    System.out.println("SOMA PAGAMENTOS: " + soma);

    double diferenca = total - soma;

    if (Math.abs(diferenca) > 0.01) {
        throw new RuntimeException(
                "Pagamento insuficiente. Falta: R$ " +
                        String.format("%.2f", diferenca)
        );
    }

    return pagamentos;
}
}