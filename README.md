# Cypress Web Automation

Este projeto utiliza o Cypress para a automação de testes web, com integração BDD (Behavior Driven Development) através do Cucumber. 

## Dependências

### Dependências de Desenvolvimento

- **@badeball/cypress-cucumber-preprocessor**: Preprocessador para integração do Cypress com o Cucumber.
- **@bahmutov/cypress-esbuild-preprocessor**: Preprocessador para usar o ESBuild no Cypress.
- **@faker-js/faker**: Biblioteca para geração de dados fictícios.
- **cypress**: Framework de automação de testes para aplicações web.
- **cypress-cucumber-preprocessor**: Outro preprocessador para integração Cucumber com Cypress.
- **cypress-plugin-api**: Biblioteca para facilitar a automação de APIs no Cypress.
- **esbuild**: Ferramenta para construção e minificação de código.
- **mochawesome**: Extensão para relatórios de testes no Cypress.
- **prettier**: Ferramenta para formatação de código.

### Dependências Principais

- **prettier**: Ferramenta de formatação de código para garantir o padrão do projeto.

## Scripts

- `cy:open`: Abre o Cypress em modo interativo.
- `cy:tests`: Executa os testes automatizados usando o Cypress.

## Configurações do Cypress

O `cypress-cucumber-preprocessor` está configurado para:
- Não utilizar definições globais para steps (`nonGlobalStepDefinitions: true`).
- Caminho dos step definitions: `cypress/support/step_definitions`.

## Pré-requisitos

Certifique-se de ter o seguinte instalado antes de começar:
- Node.js
- Cypress

## Como começar

1. Clone o repositório:
   ```bash
   git clone https://github.com/leoautqa/Avaliacao_Tecnica_NTT_DATA.git

2. Entre no diretório do projeto:
  ```bash
    cd cypress_web_automation
  ```

3. Instale as dependências:
  ```bash
    npm install
  ```

4. Para rodar os testes em modo interativo, use:
  ```bash
    npm run cy:open
  ```

5. Para executar os testes de forma automatizada, use:
  ```bash
    npm run cy:tests
  ```

## Relatórios

Os relatórios dos testes estão sendo gerados usando o mochawesome, que pode ser acessado nos seguintes locais:

- `cypress/results/report.html`

## Autor

Leo