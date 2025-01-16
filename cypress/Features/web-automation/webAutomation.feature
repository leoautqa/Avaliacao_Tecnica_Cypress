@WebAutomation
Feature: Web Automation

@web01
Scenario: 01 Login de usuário com credenciais válidas
    Given Que o usuário está na página de login
    When  Ele preencher os campos e realizar o login
    Then  Ele deve ser redirecionado para a página principal

@web02
Scenario: 02 Cadastro de novo produto por um administrador
    Given Que o administrador está autenticado e na página de cadastro de "produtos"
    When  Ele preencher o nome do produto "Produto Teste", preço "100", descrição "Descrição do Produto", e quantidade "10"
      And Clicar no botão cadastrar "Produto"
    Then  O produto deve aparecer na listagem de produtos

@web03
Scenario: 03 Cadastro de um novo usuário com sucesso
    Given Que o administrador está autenticado e na página de cadastro de "usuarios"
      And preenche os campos obrigatórios com dados válidos:
        | campo     | valor                |
        | nome      | João Silva           |
        | email     | joao.silva@email.com |
        | senha     | senha123             |
        | tipo      | regular              |
    When Clicar no botão cadastrar "Usuario"
    Then O usuário deve ser criado no sistema