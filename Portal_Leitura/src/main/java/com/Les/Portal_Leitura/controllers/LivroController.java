package com.Les.Portal_Leitura.controllers;


import  com.Les.Portal_Leitura.domain.cliente.Livro;
import com.Les.Portal_Leitura.service.LivroService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/livro")
@CrossOrigin("*")

public class LivroController {


    @Autowired
    private LivroService service;

    @PostMapping
    public Livro salvar(@RequestBody Livro livro) {
        return service.salvar(livro);
    }

    @GetMapping
    public List<Livro> listar() {
        return service.listar();
    }
}



