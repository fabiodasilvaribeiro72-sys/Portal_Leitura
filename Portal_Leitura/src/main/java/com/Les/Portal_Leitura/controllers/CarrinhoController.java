package com.Les.Portal_Leitura.controllers;

import com.Les.Portal_Leitura.domain.cliente.Carrinho;
import com.Les.Portal_Leitura.domain.cliente.Cliente;
import com.Les.Portal_Leitura.dto.CarrinhoDto;
import com.Les.Portal_Leitura.dto.ItemDto;
import com.Les.Portal_Leitura.repository.CarrinhoRepository;
import com.Les.Portal_Leitura.service.CarrinhoService;

import com.Les.Portal_Leitura.service.ClienteService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/carrinho")
@CrossOrigin("*")
public class CarrinhoController {

    @Autowired
    private ClienteService clienteService;

    @Autowired
    private CarrinhoRepository carrinhoRepository;

    // 🔥 BUSCAR CARRINHO DO CLIENTE
    @GetMapping("/{clienteId}")
    public ResponseEntity<?> buscarCarrinho(@PathVariable Long clienteId) {

        Optional<Carrinho> carrinhoOpt = carrinhoRepository.findTopByClienteIdOrderByIdDesc(clienteId);
        if (carrinhoOpt.isEmpty()) {
            return ResponseEntity.ok().body(null);
        }

        Carrinho carrinho = carrinhoOpt.get();


        CarrinhoDto dto = new CarrinhoDto();
        dto.setClienteId(carrinho.getClienteId());

        List<ItemDto> itensDto = carrinho.getItens().stream().map(item -> {
            ItemDto i = new ItemDto();
            i.setNomeLivro(item.getNomeLivro());
            i.setPreco(item.getPreco());
            i.setQuantidade(item.getQuantidade());
            i.setImagem(item.getImagem());

            return i;
        }).toList();

        dto.setItens(itensDto);

        return ResponseEntity.ok(dto);
    }
    @PostMapping
    public ResponseEntity<?> salvarCarrinho(@RequestBody Carrinho carrinhoRequest) {

        Optional<Carrinho> carrinhoOpt =
                carrinhoRepository.findTopByClienteIdOrderByIdDesc(carrinhoRequest.getClienteId());

        Carrinho carrinho;

        if (carrinhoOpt.isPresent()) {
            carrinho = carrinhoOpt.get();

            // 🔥 adiciona itens ao carrinho existente
            carrinho.getItens().addAll(carrinhoRequest.getItens());

        } else {
            carrinho = carrinhoRequest;
        }

        Carrinho salvo = carrinhoRepository.save(carrinho);

        return ResponseEntity.ok(salvo);
    }


    @PostMapping("/salvar")
    public Cliente salvar(@RequestBody Cliente cliente) {
        Cliente novo = clienteService.cadastrarCliente(cliente);

        Carrinho carrinho = new Carrinho();
        carrinho.setClienteId(novo.getId());

        carrinhoRepository.save(carrinho);

        return novo;
    }
}

