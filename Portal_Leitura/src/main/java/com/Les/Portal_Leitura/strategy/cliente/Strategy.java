package com.Les.Portal_Leitura.strategy.cliente;

public interface Strategy<T> {
    void executar(T entidade);
}