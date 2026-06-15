package com.Les.Portal_Leitura.controllers;

import com.Les.Portal_Leitura.domain.cliente.Cliente;
import com.Les.Portal_Leitura.repository.ClienteRepository;
import com.Les.Portal_Leitura.service.ClienteService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/cliente")
@CrossOrigin("*")
public class ClienteController {

    @Autowired
    private ClienteService clienteService;

    @Autowired
    private ClienteRepository clienteRepository;

    @Autowired
    private PasswordEncoder encoder;


    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> body) {

        String email = body.get("email");
        String senha = body.get("senha");

        Optional<Cliente> c = clienteRepository.findByEmail(email);

        if (c.isEmpty()) {
            return ResponseEntity.status(401).body("Usuário não encontrado");
        }

        Cliente cliente = c.get();

        if (!encoder.matches(senha.trim(), cliente.getSenha())) {
            return ResponseEntity.status(401).body("Senha inválida");
        }

        return ResponseEntity.ok(cliente);
    }

    @PostMapping("/salvar")
    public Cliente salvar(@RequestBody Cliente cliente) {
        return clienteService.cadastrarCliente(cliente);
    }

    @GetMapping("/listar")
    public List<Cliente> listar() {
        return clienteService.listarTodos();
    }

    @GetMapping("/buscar")
    public List<Cliente> buscar(
            @RequestParam(required = false) String nome,
            @RequestParam(required = false) String email
    ) {
        return clienteService.buscar(nome, email);
    }

    @PutMapping("/inativar/{id}")
    public void inativar(@PathVariable Long id) {
        clienteService.inativar(id);
    }

    @PutMapping("/{id}")
    public Cliente atualizar(@PathVariable Long id, @RequestBody Map<String, Object> dados) {
        return clienteService.atualizar(id, dados);
    }

    @PutMapping("/alterar-senha/{id}")
    public void alterarSenha(@PathVariable Long id, @RequestBody String novaSenha) {
        clienteService.alterarSenha(id, novaSenha);
    }

    @GetMapping("/{id:\\d+}")
    public ResponseEntity<?> buscarPorId(@PathVariable Long id) {

        Optional<Cliente> cliente = clienteRepository.findById(id);

        if (cliente.isEmpty()) {
            return ResponseEntity.status(404).body("Cliente não encontrado");
        }

        return ResponseEntity.ok(cliente.get());
    }

}