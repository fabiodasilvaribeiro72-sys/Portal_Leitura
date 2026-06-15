package com.Les.Portal_Leitura.service;

import com.Les.Portal_Leitura.domain.cliente.Livro;
import com.Les.Portal_Leitura.repository.LivroRepository;
import com.google.genai.Client;
import com.google.genai.types.GenerateContentResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ChatBotService {

    private final String apiKey;
    private final LivroRepository livroRepository;
    private Client client;

    // CONSTRUTOR CORRIGIDO (injeção correta do Spring)
    public ChatBotService(
            LivroRepository livroRepository,
            @Value("${gemini.api.key}") String apiKey
    ) {
        this.livroRepository = livroRepository;
        this.apiKey = apiKey;
    }

    public String responder(String mensagem) {

        if (mensagem == null || messageIsBlank(mensagem)) {
            return "Olá! Sou o assistente do Portal de Leitura. Como posso ajudar?";
        }

        // Filtro rígido para situações absurdas antes de chamar a IA (Garantia de 100% de acerto)
        String msgLower = mensagem.toLowerCase();
        if (msgLower.contains("dormi") || 
            msgLower.contains("sono") || 
            msgLower.contains("sonha") || 
            msgLower.contains("inconsciente") ||
            msgLower.contains("debaixo d'água") || 
            msgLower.contains("debaixo dagua") || 
            msgLower.contains("sob a água") || 
            msgLower.contains("sob a agua") || 
            msgLower.contains("submerso") || 
            msgLower.contains("mergulh") ||
            msgLower.contains("olhos fechados") || 
            msgLower.contains("olho fechado") || 
            msgLower.contains("olhos vendados") || 
            msgLower.contains("olho vendado") ||
            msgLower.contains("escuro total") || 
            msgLower.contains("escuro absoluto") ||
            msgLower.contains("dirigi") || 
            msgLower.contains("pilot")) {
            return "Olá! Ler em situações como dormir, debaixo d'água, dirigindo, de olhos fechados ou no escuro total não é possível ou seguro. Por isso, não posso recomendar nenhum livro para essa situação.";
        }

        List<Livro> todosOsLivros = livroRepository.findAll();

        if (todosOsLivros.isEmpty()) {
            return "Nosso catálogo está vazio no momento.";
        }

        String livrosDisponiveis = todosOsLivros.stream()
                .map(l -> "- " + l.getTitulo() + " (Autor: " + l.getAutor() + ")")
                .collect(Collectors.joining("\n"));

        String prompt =
                "Você é um assistente virtual e chatbot especialista em livros do \"Portal de Leitura\".\n" +
                "Seu objetivo é ajudar os usuários a encontrarem e recomendarem livros do nosso catálogo.\n\n" +
                "REGRAS RÍGIDAS DE COMPORTAMENTO:\n" +
                "1. RECOMENDAÇÃO EXCLUSIVA DO CATÁLOGO:\n" +
                "Você deve recomendar APENAS livros que estão na lista de \"LIVROS DISPONÍVEIS NO PORTAL\" fornecida abaixo.\n" +
                "NUNCA invente livros. NUNCA recomende livros que não estejam no catálogo. Se o usuário pedir um livro específico que não está na lista (como Harry Potter, Percy Jackson, etc.), explique educadamente que esse livro não está disponível no nosso catálogo atual e sugira livros do catálogo que mais se aproximem ou simplesmente diga que não temos.\n\n" +
                "2. REJEIÇÃO DE SITUAÇÕES ABSURDAS DE LEITURA:\n" +
                "Se o usuário solicitar uma recomendação de livro para ler em uma situação absurda, impossível ou perigosa (como dormindo, debaixo d'água, de olhos fechados, no escuro, dirigindo), explique de forma educada e amigável que não é possível ou seguro ler nessa situação e NÃO recomende nenhum livro para ela.\n\n" +
                "3. IDIOMA E TOM:\n" +
                "Responda sempre em português. Mantenha um tom prestativo, empático e amigável.\n\n" +
                "LIVROS DISPONÍVEIS NO PORTAL:\n" +
                livrosDisponiveis +
                "\n\nPergunta do usuário:\n" +
                mensagem;

        try {

            // inicializa o client uma única vez
            if (this.client == null) {
                this.client = Client.builder()
                        .apiKey(apiKey)
                        .build();
            }

            GenerateContentResponse response =
                    this.client.models.generateContent(
                            "gemini-2.5-flash",
                            prompt,
                            null
                    );

            String resposta = response.text();
            System.out.println("RESPOSTA GEMINI: " + resposta);

            return resposta;

        } catch (Exception e) {
            System.err.println("Erro detalhado na integração com o Gemini:");
            e.printStackTrace();
            return "Erro ao consultar a IA.";
        }
    }

    private boolean messageIsBlank(String msg) {
        return msg.trim().isEmpty();
    }
}