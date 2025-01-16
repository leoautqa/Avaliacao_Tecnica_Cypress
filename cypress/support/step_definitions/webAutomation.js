import { Given, When, Then} from "@badeball/cypress-cucumber-preprocessor";

const nome = "Avaliação Tecnica NTT DATA";
const email = "avaliacaotecnica@nttdata.com.br";
const senha = "avaliacaotecnicanttdata";


function realizarLogin(email, senha) {
  cy.get('input[name="email"]').type(email);
  cy.get('input[name="password"]').type(senha);
  cy.get("button[data-testid='entrar']").click();

  cy.wait(2000);
}

function resgistrarUmaNovaConta(name, email, senha) {
  cy.visit('/cadastrarusuarios'); 
  cy.get('input[name="nome"]').type(name);
  cy.get('input[name="email"]').type(email);
  cy.get('input[name="password"]').type(senha);
  cy.get('input[type="checkbox"]').click();
  cy.get('button[type="submit"]').click();
}

Given("Que o usuário está na página de login", () => {
  cy.visit("/login");
});

When("Ele preencher os campos e realizar o login", () => {
  cy.get('input[name="email"]').type(email);
  cy.get('input[name="password"]').type(senha);
  cy.get("button[data-testid='entrar']").click();

  cy.contains("Email e/ou senha inválidos").should('not.exist')
    .then(($element) => {
      if ($element) {
        resgistrarUmaNovaConta(nome, email, senha);
      }
    });
});

Then("Ele deve ser redirecionado para a página principal", () => {
  cy.contains(`Bem Vindo ${nome}`).should("be.visible");
});

Given("Que o administrador está autenticado e na página de cadastro de {string}", (end) => {
  cy.visit("/login");
  realizarLogin(email, senha);

  if (end === "produtos"){
    end = "cadastrarprodutos"
  }else if (end === "usuarios") {
    end = "cadastrarusuarios"
  }

  cy.visit(`/admin/${end}`);

  if (end === "cadastrarprodutos") {
    cy.contains(`Cadastro de Produtos`).should("be.visible");
  }else if(end = "cadastrarusuarios"){
    cy.contains(`Cadastro de usuários`).should("be.visible");
  }
});

When("Ele preencher o nome do produto {string}, preço {string}, descrição {string}, e quantidade {string}", (nomeProduto, preco, descricao, quantidade) => {
  cy.get('input[name="nome"]').type(nomeProduto);
  cy.get('input[name="price"]').type(preco);
  cy.get('textarea[name="description"]').type(descricao);
  cy.get('input[name="quantity"]').type(quantidade);
  
  cy.wrap(nomeProduto).as('produtoCriado');
  cy.wrap(preco).as('precoCriado');
  cy.wrap(descricao).as('descricaoCriado');
  cy.wrap(quantidade).as('quantidadeCriado');
});

When("Clicar no botão cadastrar {string}", (botao) => {
  if (botao === "Produto") {
    botao = "cadastarProdutos";
  } else {
    botao = "cadastrarUsuario";
  }

  cy.get(`button[data-testid='${botao}']`).click();

  if (botao === "cadastarProdutos") {
    cy.contains("Já existe produto com esse nome").should('exist')
      .then(($element) => {
        if ($element) {
          const stringAleatoria = gerarStringAlfabetica(true);
          const numeroAleatorio  = gerarNumeroAleatorio();

          cy.get('@precoCriado').then(preco => {
            cy.get('@descricaoCriado').then(descricao => {
              cy.get('@quantidadeCriado').then(quantidade => {
                let nomeProduto = " " + stringAleatoria + numeroAleatorio;
                
                cy.get('input[name="nome"]').type(nomeProduto);
                cy.get('input[name="price"]').clear().type(preco);
                cy.get('textarea[name="description"]').clear().type(descricao);
                cy.get('input[name="quantity"]').clear().type(quantidade);
              });
            });
          });

          cy.get(`button[data-testid='cadastarProdutos']`).click();
        }
      });
  }

  if (botao === "cadastrarUsuario") {
    cy.contains("Este email já está sendo usado").should('exist')
      .then(($element) => {
        if ($element) {
          cy.get('input[name="email"]').then((emailInput) => {
            const emailJaExistente = emailInput.val().replace("@email.com", "");
            const stringAleatoria = gerarStringAlfabetica(true);
            const numeroAleatorio = gerarNumeroAleatorio();
            const novoEmail = `${emailJaExistente}${stringAleatoria}${numeroAleatorio}@email.com`;

            atualizarCampo('input[name="email"]', novoEmail);
          });

          cy.get('input[name="nome"]').then((nomeInput) => {
            const nome = nomeInput.val();
            atualizarCampo('input[name="nome"]', nome);
          });

          cy.get('input[name="password"]').then((passwordInput) => {
            const password = passwordInput.val();
            atualizarCampo('input[name="password"]', password);
          });

          cy.get(`button[data-testid='cadastrarUsuario']`).click();
        }
      });
  }

  function atualizarCampo(selector, valor) {
    cy.get(selector).clear().type(valor);
  }
});

Then("O produto deve aparecer na listagem de produtos", () => {
  cy.wait(2000);   

  cy.get('@produtoCriado').then((produto) => {
    cy.contains(produto)
      .scrollIntoView()
      .should('be.visible');
  });
});

Given("preenche os campos obrigatórios com dados válidos:", (dataTable) => {
  const campoMapeado = {
    nome: "nome",
    email: "email",
    senha: "password",
    tipo: "administrador",
  };

  cy.wrap(nome).as('nomeCriado');

  dataTable.hashes().forEach((row) => {
    const campo = campoMapeado[row.campo];
    const valor = row.valor;

    if (campo === "administrador") {
      if (valor === "admin") {
        cy.get('input[name="administrador"][type="checkbox"]').check({ force: true });
      } else if (valor === "regular") {
        cy.get('input[name="administrador"][type="checkbox"]').uncheck({ force: true });
      } else {
        throw new Error(`Tipo de usuário não reconhecido: ${valor}`);
      }
    } else if (campo) {
      cy.get(`input[name="${campo}"], select[name="${campo}"], textarea[name="${campo}"]`)
        .clear()
        .type(valor, { force: true });
    } else {
      throw new Error(`Campo não reconhecido: ${row.campo}`);
    }
  });
});

Then("O usuário deve ser criado no sistema", () => {
  cy.wait(2000);   

  cy.get('@nomeCriado').then((nome) => {
    cy.contains(nome)
      .scrollIntoView()
      .should('be.visible');
  });
});

function gerarStringAlfabetica(maiusculas = true) {
  const caracteres = maiusculas
    ? 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
    : 'abcdefghijklmnopqrstuvwxyz';
  
  const tamanho = 3;  // Tamanho fixo
  let resultado = '';
  for (let i = 0; i < tamanho; i++) {
    const indiceAleatorio = Math.floor(Math.random() * caracteres.length);
    resultado += caracteres[indiceAleatorio];
  }
  return resultado;
}

function gerarNumeroAleatorio() {
  const numeros = '0123456789';
  const tamanho = 3;  // Tamanho fixo
  let resultado = '';
  for (let i = 0; i < tamanho; i++) {
    const indiceAleatorio = Math.floor(Math.random() * numeros.length);
    resultado += numeros[indiceAleatorio];
  }
  return resultado;
}