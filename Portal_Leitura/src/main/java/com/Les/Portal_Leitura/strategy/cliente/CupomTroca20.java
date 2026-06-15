package com.Les.Portal_Leitura.strategy.cliente;

import org.springframework.stereotype.Component;

@Component("TROCA20")
public class CupomTroca20 implements CupomStrategy {

    @Override
    public double aplicarDesconto(double valor) {

        // 🔥 NÃO APLICA DESCONTO
        return valor;
    }
}


