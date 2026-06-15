package com.Les.Portal_Leitura.strategy.cliente;


import org.springframework.stereotype.Component;

@Component("DESCONTO10")
public class CupomDesconto10 implements CupomStrategy {
    public double aplicarDesconto(double valor){
        return valor *0.9;
    }
}
