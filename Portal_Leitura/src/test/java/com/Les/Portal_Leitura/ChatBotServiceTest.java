package com.Les.Portal_Leitura;

import com.Les.Portal_Leitura.domain.cliente.Livro;
import com.Les.Portal_Leitura.repository.LivroRepository;
import com.Les.Portal_Leitura.service.ChatBotService;
import com.google.genai.Client;
import com.google.genai.models.Models;
import com.google.genai.types.GenerateContentResponse;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.test.util.ReflectionTestUtils;

import java.util.ArrayList;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

class ChatBotServiceTest {

    private LivroRepository livroRepository;
    private ChatBotService chatBotService;
    private Client mockClient;
    private Models mockModels;

    @BeforeEach
    void setUp() {
        livroRepository = mock(LivroRepository.class);
        mockClient = mock(Client.class);
        mockModels = mock(Models.class);
        
        // Define mock behaviour for Client
        mockClient.models = mockModels;
        
        chatBotService = new ChatBotService(livroRepository, "fake-api-key");
        
        // Inject mockClient into chatBotService to avoid real HTTP requests
        ReflectionTestUtils.setField(chatBotService, "client", mockClient);
    }

    @Test
    void testResponderComMensagemVazia() {
        String resposta = chatBotService.responder("");
        assertEquals("Olá! Sou o assistente do Portal de Leitura. Como posso ajudar?", resposta);
    }

    @Test
    void testResponderSemLivrosNoCatalogo() {
        when(livroRepository.findAll()).thenReturn(new ArrayList<>());
        String resposta = chatBotService.responder("Recomende um livro");
        assertEquals("Nosso catálogo está vazio no momento.", resposta);
    }

    @Test
    void testResponderComSucesso() {
        List<Livro> livros = new ArrayList<>();
        Livro livro1 = mock(Livro.class);
        when(livro1.getTitulo()).thenReturn("Dom Casmurro");
        when(livro1.getAutor()).thenReturn("Machado de Assis");
        livros.add(livro1);

        when(livroRepository.findAll()).thenReturn(livros);

        GenerateContentResponse mockResponse = mock(GenerateContentResponse.class);
        when(mockResponse.text()).thenReturn("Eu recomendo Dom Casmurro de Machado de Assis.");

        when(mockModels.generateContent(
                eq("gemini-2.5-flash"),
                anyString(),
                isNull()
        )).thenReturn(mockResponse);

        String resposta = chatBotService.responder("Me recomende um livro de romance");
        
        verify(livroRepository).findAll();
        verify(mockModels).generateContent(eq("gemini-2.5-flash"), anyString(), isNull());
        assertEquals("Eu recomendo Dom Casmurro de Machado de Assis.", resposta);
    }

    @Test
    void testResponderComSituacaoAbsurda() {
        String respostaDormindo = chatBotService.responder("Quero um livro para ler dormindo");
        assertTrue(respostaDormindo.contains("não é possível ou seguro"));

        String respostaAgua = chatBotService.responder("Qual livro ler debaixo d'agua?");
        assertTrue(respostaAgua.contains("não é possível ou seguro"));
    }
}
