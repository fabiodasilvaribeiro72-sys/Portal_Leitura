package com.Les.Portal_Leitura.controllers;


import com.Les.Portal_Leitura.domain.cliente.Cartao;
import com.Les.Portal_Leitura.domain.cliente.Cliente;
import com.Les.Portal_Leitura.dto.CartaoDto;
import com.Les.Portal_Leitura.repository.ClienteRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/cartao")
public class CartaoController {

    @Autowired
    private ClienteRepository clienteRepository;

    @PostMapping("/adicionar")
    public ResponseEntity<?> adicionarCartao(@RequestBody CartaoDto dto) {

        Cliente cliente = clienteRepository.findById(dto.getClienteId())
                .orElseThrow(() -> new RuntimeException("Cliente não encontrado"));

        Cartao cartao = new Cartao();

        cartao.setNumero(dto.getNumero());
        cartao.setNomeImpresso(dto.getNome());
        cartao.setBandeira(dto.getBandeira());
        cartao.setCodigoSeguranca(dto.getCodigo());

        cliente.getCartoes().add(cartao);

        clienteRepository.save(cliente);

        Cartao cartaoSalvo =
                cliente.getCartoes()
                        .get(cliente.getCartoes().size() - 1);

        return ResponseEntity.ok(cartaoSalvo);
    }

    @GetMapping("/{clienteId}")
    public List<Cartao> listarCartoes(@PathVariable Long clienteId) {

        Cliente cliente = clienteRepository.findById(clienteId)
                .orElseThrow(() -> new RuntimeException("Cliente não encontrado"));

        return cliente.getCartoes(); // 🔥 pega direto da lista
    }


}
