package com.Les.Portal_Leitura.controllers;


import com.Les.Portal_Leitura.dto.ChatRequestDto;
import com.Les.Portal_Leitura.service.ChatBotService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/chat")
@CrossOrigin("*")


public class ChatBotController {

    @Autowired
    private ChatBotService chatBotService;

    @PostMapping
    public Map<String, String> conversar (@RequestBody ChatRequestDto dto)

    {

        String resposta = chatBotService.responder(dto.getMensagem());

        return Map.of(
                "resposta",
                resposta);
    }
}
