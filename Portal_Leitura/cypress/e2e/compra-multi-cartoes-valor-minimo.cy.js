Cypress.on('uncaught:exception', () => false);

describe('Validação de Valor Mínimo do Cartão', () => {

    it('Deve falhar a finalização da compra se um dos cartões tiver valor inferior a 10 reais', () => {
        const timestamp = Date.now();
        const nomeCliente = `Felipe ErroValor ${timestamp}`;
        const email = `felipe_erro_${timestamp}@teste.com`;
        const cpf = `242${Math.floor(10000000 + Math.random() * 90000000)}`;

        // ============================
        // 1. SELEÇÃO DE PRODUTOS
        // ============================
        cy.visit('http://localhost:8080/index.html');

        // Adiciona dois livros diferentes
        cy.contains('.livros', 'Factotum')
            .contains('Comprar')
            .click({ force: true });

        cy.contains('.livros', 'Codigo da Vinci')
            .contains('Comprar')
            .click({ force: true });

        // Abre o carrinho
        cy.get('.cart').click();

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
        // 3. CHECKOUT & ADICIONAR CARTÕES
        // ============================
        // Informa endereço de entrega
        cy.get('#cep', { timeout: 10000 }).type('01311200');
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

        // Cartão 2
        cy.get('#numero').clear().type('5105105105105105');
        cy.get('#nomeImpresso').clear().type('FELIPE A ALBUQUERQUE');
        cy.get('#bandeira').clear().type('Mastercard');
        cy.get('#codigoSeguranca').clear().type('456');
        cy.contains('button', 'Adicionar Cartão').click();

        // Divide pagamento informando valor menor que 10 no cartão 2 (ex: R$ 5,00)
        cy.get('#total')
            .invoke('text')
            .then(texto => {
                const total = parseFloat(texto.replace('R$', '').replace(',', '.').trim());
                
                // Primeiro cartão com valor principal, segundo com apenas R$ 5.00
                const valorCartao2 = 5.00;
                const valorCartao1 = total - valorCartao2;

                cy.get('.valorCartao').eq(0).type(valorCartao1.toFixed(2).toString());
                cy.get('.valorCartao').eq(1).type(valorCartao2.toFixed(2).toString());
            });

        // Configura captura de alert
        const alertStub = cy.stub();
        cy.on('window:alert', alertStub);

        // Tenta finalizar compra
        cy.contains('Finalizar Compra').click();

        // Valida que o alert de erro de valor mínimo foi disparado
        cy.then(() => {
            expect(alertStub).to.be.calledWith('Cada cartão precisa ter no mínimo R$ 10');
        });

        // Garante que a url permaneceu no perfil/checkout e não finalizou
        cy.url().should('include', 'perfil.html');
    });
});
