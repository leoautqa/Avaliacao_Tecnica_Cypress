Feature: API Automation

Scenario: 01 Criar um usuário
    When  Cadastrar um usuario "regular"
    Then  Buscar o usuário pelo ID

Scenario: 02 Criar um produto
    Given Cadastrar um usuario "admin"
     And  Fazer login
    When  Cadastrar um produto
    Then  Buscar produto pelo ID

Scenario: 03 Colocar um produto no carrinho
    Given Cadastrar um usuario "admin"
     And  Fazer login
    When  Cadastrar um produto
    Then  Colocar o produto no carrinho