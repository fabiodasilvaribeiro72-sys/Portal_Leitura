package com.Les.Portal_Leitura.domain.cliente;

public enum StatusPedido {
    CARRINHO,
    PROCESSANDO,
    AGUARDANDO_APROVACAO,
    APROVADO,
    RECUSADO,
    DESPACHADO,         // 🔥 NOVO
    CANCELADO,
    FINALIZADO,
    EM_TRANSPORTE,
    ENTREGUE,


}
