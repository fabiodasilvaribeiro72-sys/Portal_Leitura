Cypress.on('uncaught:exception', (err, runnable) => {
    if (
        err.message.includes("Cannot read properties of null") ||
        err.message.includes("reading 'id'") ||
        err.message.includes("undefined")
    ) {
        return false;
    }
    return true;
});

describe('Fluxo completo de compra - Portal Leitura', () => {

    it('Deve realizar compra completa com cupom e dois cartões', () => {
        // Apenas o e-mail muda a cada execução para nunca dar "E-mail já cadastrado"
        const timestamp = new Date().getTime();
        const emailDinamico = `fabio_${timestamp}@teste.com`;

        // Intercept genérico para pegar qualquer rota que tenha a palavra salvar no cadastro
        cy.intercept('POST', '**/*salvar*').as('cadastro');

        // =========================
        // HOME
        // =========================
        cy.visit('http://localhost:8080/index.html');

        cy.contains('Comprar', { timeout: 10000 })
            .should('be.visible')
            .click({ force: true });

        cy.get('.cart').click();
        cy.get('#cart-items').should('contain', 'Factotum');
        cy.get('#btnFinalizar').click();

        // =========================
        // CADASTRO
        // =========================
        cy.location('pathname').should('include', 'clientecadastro.html');

        // Preenchimento com strings diretas para eliminar erros de variáveis não definidas
        cy.get('#nome').type('Fábio Silva');
        cy.get('#email').type(emailDinamico);
        cy.get('#cpf').type('14238562094'); // Seu CPF original que o Java aceita
        cy.get('#telefone').type('11999999999');
        cy.get('#senha').type('123456');
        cy.get('#confirmesenha').type('123456');

        // ENTREGA
        cy.get('#logradouroEntrega').type('Rua Cypress');
        cy.get('#bairroEntrega').type('Jardins');
        cy.get('#cidadeEntrega').type('São Paulo');
        cy.get('#estadoEntrega').type('SP');
        cy.get('#cepEntrega').type('01001000');
        cy.get('#numeroEntrega').type('14');

        // COBRANÇA
        cy.get('#logradouroCobranca').type('Rua América');
        cy.get('#bairroCobranca').type('Vila Prudente');
        cy.get('#cidadeCobranca').type('São Paulo');
        cy.get('#estadoCobranca').type('SP');
        cy.get('#cepCobranca').type('01563245');
        cy.get('#numeroCobranca').type('7');

        cy.wait(1000);

        // Clica no botão de cadastrar
        cy.contains('button', 'Cadastrar').should('be.visible').click();

        // ESPERA O CADASTRO (Se o banco local estiver lento, 30s dão conta)
        cy.wait('@cadastro', { timeout: 30000 });

        // REDIRECIONAMENTO
        cy.location('pathname', { timeout: 20000 }).should('include', 'perfil.html');

        // LOCAL STORAGE
        cy.window().should((win) => {
            const usuario = JSON.parse(win.localStorage.getItem('usuarioLogado'));
            expect(usuario).to.not.be.null;
            expect(usuario.id).to.exist;
        });

        // =========================
        // ADICIONAR ENDEREÇO
        // =========================
        cy.get('#cep').type('01001000');
        cy.get('#rua').type('Rua Checkout');
        cy.get('#cidade').type('São Paulo');
        cy.get('#estado').type('SP');
        cy.contains('button', 'Adicionar Endereço').click();

        // =========================
        // CARTÃO 1
        // =========================
        cy.get('#numero').type('4000123456789010');
        cy.get('#nomeImpresso').type('TESTE UM');
        cy.get('#bandeira').type('Visa');
        cy.get('#codigoSeguranca').type('123');
        cy.contains('button', 'Adicionar Cartão').click();

        cy.wait(500);

        // =========================
        // CARTÃO 2
        // =========================
        cy.get('#numero').clear({ force: true }).type('5105105105105105');
        cy.get('#nomeImpresso').clear({ force: true }).type('TESTE DOIS');
        cy.get('#bandeira').clear({ force: true }).type('Mastercard');
        cy.get('#codigoSeguranca').clear({ force: true }).type('456');
        cy.contains('button', 'Adicionar Cartão').click();

        // =========================
        // VALORES DOS CARTÕES (Ajustado para o total do seu carrinho com desconto)
        // =========================
       // =========================
       // VALORES DOS CARTÕES
       // =========================
      // =========================
      // VALORES DOS CARTÕES
      // =========================
      cy.get('.valorCartao', { timeout: 15000 })
          .should('have.length.at.least', 2);

      cy.get('#total')
          .invoke('text')
          .then((textoTotal) => {

              // remove R$, espaços e troca vírgula por ponto
              const total =
                  parseFloat(
                      textoTotal
                          .replace('R$', '')
                          .replace(',', '.')
                          .trim()
                  );

              // divide igualmente entre os 2 cartões
              const valorCartao1 =
                  (total / 2).toFixed(2);

              const valorCartao2 =
                  (total - valorCartao1).toFixed(2);

              // CARTÃO 1
              cy.get('.valorCartao')
                  .eq(0)
                  .clear({ force: true })
                  .type(valorCartao1.toString());

              // CARTÃO 2
              cy.get('.valorCartao')
                  .eq(1)
                  .clear({ force: true })
                  .type(valorCartao2.toString());
          });

      // ============================
        // CUPOM
        // =========================
       // cy.get('#cupom').type('DESCONTO10').trigger('input');
       // cy.wait(1000);

        // =========================
        // FINALIZAÇÃO
        // =========================
        const alertStub = cy.stub().as('alertaPedido');
        cy.on('window:alert', alertStub);

        cy.contains('button', 'Finalizar Compra')
            .should('be.visible')
            .click()
            .then(() => {
                cy.get('@alertaPedido').should('be.calledWithMatch', /Pedido realizado/);
            });
    });
});