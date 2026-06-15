describe('Fluxo completo com pagamento dividido', () => {

  it('deve cadastrar, carregar carrinho, aplicar desconto e pagar com 2 cartões', () => {

    cy.visit('http://localhost:8080/index.html')

    // 🔥 adiciona produto
    cy.get('.buy-button').first().click()

    cy.window().then((win) => {
      const cart = JSON.parse(win.localStorage.getItem('cart')) || []
      expect(cart.length).to.be.greaterThan(0)
    })

    // cadastro
    cy.visit('http://localhost:8080/clientecadastro.html')

    cy.get('#nome').type('Teste Cypress')
    cy.get('#email').type(`teste${Date.now()}@email.com`)
    cy.get('#cpf').type('12345678900')
    cy.get('#telefone').type('11999999999')
    cy.get('#senha').type('123')
    cy.get('#confirmesenha').type('123')

    cy.get('#logradouroEntrega').type('Rua Teste')
    cy.get('#bairroEntrega').type('Centro')
    cy.get('#cidadeEntrega').type('SP')
    cy.get('#estadoEntrega').type('SP')
    cy.get('#cepEntrega').type('01001000')
    cy.get('#numeroEntrega').type('123')

    cy.get('#logradouroCobranca').type('Rua Teste')
    cy.get('#bairroCobranca').type('Centro')
    cy.get('#cidadeCobranca').type('SP')
    cy.get('#estadoCobranca').type('SP')
    cy.get('#cepCobranca').type('01001000')
    cy.get('#numeroCobranca').type('123')

    cy.contains('button', 'Cadastrar').click()

    cy.wait(1500)
    cy.visit('http://localhost:8080/perfil.html')

    // 🔥 espera carregar
    cy.get('#nome', { timeout: 10000 }).should('not.contain', 'Carregando')

    cy.get('#listaPedidos', { timeout: 10000 })
      .should('contain', 'R$')

    // 🔥 adiciona endereço manual (TESTANDO BOTÃO)
    cy.get('#cep').type('01001000')
    cy.get('#rua').type('Rua Nova')
    cy.get('#cidade').type('SP')
    cy.get('#estado').type('SP')

    cy.contains('button', 'Adicionar Endereço').click()

    cy.get('#enderecos').find('option').should('have.length.greaterThan', 0)

    cy.get('#enderecos').select(0)

    // 🔥 cupom
    cy.get('#cupom').type('DESCONTO10')

    // 🔥 pega total REAL
    cy.get('#total', { timeout: 10000 })
      .invoke('text')
      .then((totalText) => {

        const total = parseFloat(totalText)

        expect(total).to.be.greaterThan(0)

        const metade = (total / 2).toFixed(2)

        // 🔥 CARTÃO 1
        cy.get('#numero').type('1111111111111111')
        cy.get('#nomeImpresso').type('Teste 1')
        cy.get('#bandeira').type('VISA')
        cy.get('#codigoSeguranca').type('123')

        cy.contains('button', 'Adicionar Cartão').click()

        // 🔥 define valor cartão 1
        cy.get('#pagamentosCartoes')
          .should('exist')

        cy.get('#pagamentosCartoes input').first()
          .clear()
          .type(metade)

        // 🔥 CARTÃO 2
        cy.get('#numero').clear().type('2222222222222222')
        cy.get('#nomeImpresso').clear().type('Teste 2')
        cy.get('#bandeira').clear().type('MASTERCARD')
        cy.get('#codigoSeguranca').clear().type('456')

        cy.contains('button', 'Adicionar Cartão').click()

        // 🔥 define valor cartão 2
        cy.get('#pagamentosCartoes input').eq(1)
          .clear()
          .type(metade)

        // 🔥 valida soma dos pagamentos
        cy.get('#pagamentosCartoes input').then(inputs => {
          let soma = 0
          inputs.each((i, el) => {
            soma += parseFloat(el.value)
          })

          expect(soma.toFixed(2)).to.eq(total.toFixed(2))
        })

      })

    // 🔥 finaliza compra
    cy.contains('button', 'Finalizar Compra').click()

    // 🔥 sucesso
    cy.get('#statusPedido', { timeout: 10000 })
      .should('not.be.empty')
  })
})