Cypress.on('uncaught:exception', () => false);

describe('Compra Multi Cartões com Cupom DESCONTO10', () => {

    it('Deve comprar mais de um item, usar cupom DESCONTO10, ratear em 2 cartões e concluir fluxo no adminvendas', () => {
        const timestamp = Date.now();
        const nomeCliente = `Felipe Desconto10 ${timestamp}`;
        const email = `felipe_desc10_${timestamp}@teste.com`;
        const cpf = `242${Math.floor(10000000 + Math.random() * 90000000)}`;

        // ============================
        // 1. SELEÇÃO DE PRODUTOS
        // ============================
        cy.visit('http://localhost:8080/index.html');

        // Adiciona dois livros diferentes
        cy.contains('.livros', 'Factotum')
            .contains('Comprar')
            .click({ force: true });
        cy.contains('.livro-nome', 'Codigo Da Vinci')
        .closest('.livros')
        .find('.buy-button')
        .click({ force: true });

        // Abre o carrinho
        cy.get('.cart').click();

        // Valida itens no carrinho
        cy.get('#cart-items').should('contain', 'Factotum');
        cy.get('#cart-items').should('contain', 'Codigo da Vinci');

        // Vai para a tela de cadastro
        cy.get('#btnFinalizar').click({ force: true });

        // ============================
        // 2. CADASTRO DE CLIENTE
        // ============================
        cy.get('#nome').type(nomeCliente);
        cy.get('#email').type(email);
        cy.get('#cpf').type(cpf);
        cy.get('#telefone').type('11988887777');
        cy.get('#senha').type('password123');
        cy.get('#confirmesenha').type('password123');

        // Endereço de entrega
        cy.get('#logradouroEntrega').type('Avenida Paulista');
        cy.get('#bairroEntrega').type('Bela Vista');
        cy.get('#cidadeEntrega').type('São Paulo');
        cy.get('#estadoEntrega').type('SP');
        cy.get('#cepEntrega').type('01311200');
        cy.get('#numeroEntrega').type('1000');

        // Endereço de cobrança
        cy.get('#logradouroCobranca').type('Avenida Paulista');
        cy.get('#bairroCobranca').type('Bela Vista');
        cy.get('#cidadeCobranca').type('São Paulo');
        cy.get('#estadoCobranca').type('SP');
        cy.get('#cepCobranca').type('01311200');
        cy.get('#numeroCobranca').type('1000');

        cy.contains('Cadastrar').click();

        // ============================
        // 3. CHECKOUT & DIVISÃO DE CARTÕES
        // ============================
       // ============================
       // 3. CHECKOUT & DIVISÃO DE CARTÕES
       // ============================

       // Se o sistema redirecionar para perfil após cadastro
       cy.url().then(url => {
           if (url.includes('perfil.html')) {
               cy.visit('http://localhost:8080/checkout.html');
           }
       });

       // Endereço
       cy.get('#cep', { timeout: 15000 }).should('be.visible').type('01311200');
       cy.get('#rua').type('Avenida Paulista');
       cy.get('#cidade').type('São Paulo');
       cy.get('#estado').type('SP');

       cy.contains('button', 'Adicionar Endereço').click();

       // Cartão 1
       cy.get('#numero').type('4000123456789010');
       cy.get('#nomeImpresso').type('FELIPE A ALBUQUERQUE');
       cy.get('#bandeira').type('Visa');
       cy.get('#codigoSeguranca').type('123');

       cy.contains('button', 'Adicionar Cartão').click();

       // Espera o cartão aparecer
       cy.get('.valorCartao', { timeout: 10000 })
           .should('have.length.at.least', 1);

       // Cartão 2
       cy.get('#numero').clear().type('5105105105105105');
       cy.get('#nomeImpresso').clear().type('FELIPE A ALBUQUERQUE');
       cy.get('#bandeira').clear().type('Mastercard');
       cy.get('#codigoSeguranca').clear().type('456');

       cy.contains('button', 'Adicionar Cartão').click();

       // Espera os dois cartões aparecerem
       cy.get('.valorCartao', { timeout: 10000 })
           .should('have.length', 2);

       // Aplica cupom
       cy.get('#cupom')
           .clear()
           .type('DESCONTO10');

       // Se existir botão aplicar cupom
       cy.get('body').then($body => {
           if ($body.find('#btnAplicarCupom').length) {
               cy.get('#btnAplicarCupom').click();
           }
       });

       // Aguarda atualização do total
       cy.wait(1000);

       // Calcula rateio
       cy.get('#total')
           .invoke('text')
           .then(texto => {

               const total = parseFloat(
                   texto
                       .replace('R$', '')
                       .replace(/\s/g, '')
                       .replace(',', '.')
               );

               expect(total).to.be.greaterThan(0);

               const valor1 = Number((total / 2).toFixed(2));
               const valor2 = Number((total - valor1).toFixed(2));

               cy.log(`Total: ${total}`);
               cy.log(`Cartão 1: ${valor1}`);
               cy.log(`Cartão 2: ${valor2}`);

               // Aguarda habilitação dos campos
               cy.get('.valorCartao')
                   .eq(0)
                   .should('not.be.disabled')
                   .clear()
                   .type(valor1.toString());

               cy.get('.valorCartao')
                   .eq(1)
                   .should('not.be.disabled')
                   .clear()
                   .type(valor2.toString());
           });

       // Finaliza compra
       cy.contains('Finalizar Compra')
           .should('be.visible')
           .click();
        // ============================
        // 4. ADMIN VENDAS - AVALIAÇÃO DO PEDIDO
        // ============================
        cy.visit('http://localhost:8080/adminvendas.html');

        // Garante que o pedido consta e exibe o cupom promocional DESCONTO10
        cy.contains('td', nomeCliente, { timeout: 15000 })
            .parent('tr')
            .should('contain', 'DESCONTO10');

        // Aprova o pedido (Aprovar Compra)
        cy.contains('td', nomeCliente)
            .parent('tr')
            .find('.btn-aprovar')
            .click();

        cy.reload();

        // Despacha o pedido
        cy.contains('td', nomeCliente)
            .parent('tr')
            .find('.btn-despachar')
            .click();

        cy.reload();

        // Confirma entrega
        cy.on('window:confirm', () => true);
        cy.contains('td', nomeCliente)
            .parent('tr')
            .find('.btn-entregar')
            .click();

        cy.reload();

        // Garante o status FINALIZADO
        cy.contains('td', nomeCliente)
            .parent('tr')
            .should('contain', 'FINALIZADO');
    });
});
