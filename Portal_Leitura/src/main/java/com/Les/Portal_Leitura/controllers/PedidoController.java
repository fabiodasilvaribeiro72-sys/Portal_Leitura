package com.Les.Portal_Leitura.controllers;

import com.Les.Portal_Leitura.domain.cliente.Pedido;
import com.Les.Portal_Leitura.dto.CheckoutRequestDTO;
import com.Les.Portal_Leitura.dto.PedidoDto;
import com.Les.Portal_Leitura.dto.PedidoResponseDto;
import com.Les.Portal_Leitura.service.PedidoService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/pedido")
@CrossOrigin(origins = "*")
public class PedidoController {

    @Autowired
    private PedidoService pedidoService;

    @PostMapping("/finalizar")
    public ResponseEntity<PedidoResponseDto> finalizar(@RequestBody CheckoutRequestDTO dto) {

        Pedido pedido = pedidoService.finalizarPedido(dto);

        PedidoResponseDto response = new PedidoResponseDto();
        response.setId(pedido.getId()); // agora é Long → Long ✅
        response.setStatus(pedido.getStatus().name());

        return ResponseEntity.ok(response);
    }
    @GetMapping("/cliente/{clienteId}")
    public ResponseEntity<List<PedidoResponseDto>> buscarPorCliente(@PathVariable Long clienteId) {

        List<Pedido> pedidos = pedidoService.buscarPorCliente(clienteId);

        List<PedidoResponseDto> response = pedidos.stream().map(p -> {
            PedidoResponseDto dto = new PedidoResponseDto();
            dto.setId(p.getId());
            dto.setStatus(p.getStatus().name());
            dto.setTotal(p.getValorTotal());
            dto.setItens(p.getItens());
            return dto;
        }).toList();

        return ResponseEntity.ok(response);
    }
}