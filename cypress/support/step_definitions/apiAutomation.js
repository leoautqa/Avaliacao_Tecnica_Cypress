import { Given, When, Then } from "@badeball/cypress-cucumber-preprocessor";
import { faker } from "@faker-js/faker"

const url = Cypress.config('apiBaseUrl');

When("Cadastrar um usuario {string}", (tipo) => {
  const nomeFaker = faker.person.fullName();
  const emailFaker = faker.internet.email(); 
  const senhaFaker = faker.internet.password(); 
  
  cy.wrap(emailFaker).as('emailCriado');
  cy.wrap(senhaFaker).as('senhaCriada');

  if(tipo === "regular"){
    tipo = 'false'
  }else{
    tipo = 'true'
  }

  const payload = {
    nome: nomeFaker,
    email: emailFaker,
    password: senhaFaker,
    administrador: tipo
  };

  cy.request({
    method: 'POST',
    url: `${url}/usuarios`,
    body: payload,
    headers: {
      'Content-Type': 'application/json'
    }
  }).then((response) => {  
    expect(response.status).to.eq(201);
    expect(response.body).to.have.property('message', 'Cadastro realizado com sucesso');
    
    const userId = response.body._id;
    
    cy.wrap(userId).as('userId');
  });
});

Then("Buscar o usuário pelo ID", () =>{
  cy.get('@userId').then((userId) => {
    cy.request({
      method: 'GET',
      url: `${url}/usuarios/${userId}`,
      headers: {
        'Content-Type': 'application/json'
      }
    }).then((response) => {
      expect(response.status).to.eq(200); 
      expect(response.body._id).to.eq(userId); 
    });
  });
})

Given("Fazer login", () =>{
  cy.get('@emailCriado').then((email) => {
    cy.get('@senhaCriada').then((senha) => {
      const payload = {
        email: email,
        password: senha,
      };

      cy.request({
        method: 'POST',
        url: `${url}/login`,
        body: payload,
        headers: {
          'Content-Type': 'application/json'
        }
      }).then((response) => { 
        expect(response.status).to.eq(200);
        expect(response.body).to.have.property('message', 'Login realizado com sucesso');
        
        const Bearer = response.body.authorization;
        const token = Bearer.replace('Bearer ', '');
    
        cy.wrap(token).as('token');
      });
    });
  });  
})

When("Cadastrar um produto", () => {
  const bookFaker = faker.book.title();
  
  const payload = {
    nome: bookFaker,
    preco: 100,
    descricao: "Livro",
    quantidade: 8
  };

  cy.get('@token').then((token) => { 
    cy.request({
      method: 'POST',
      url: `${url}/produtos`,
      body: payload,
      headers: {
        Authorization: `Bearer ${token}`, 
        'Content-Type': 'application/json'
      }
    }).then((response) => { 
      expect(response.status).to.eq(201);
      expect(response.body).to.have.property('message', 'Cadastro realizado com sucesso');
      
      const prodId = response.body._id;
      
      cy.wrap(prodId).as('prodId');
    });
  });
});

Then("Buscar produto pelo ID", () => {
  cy.get('@prodId').then((prodId) => {
    cy.request({
      method: 'GET',
      url: `${url}/produtos/${prodId}`,
      headers: {
        'Content-Type': 'application/json'
      }
    }).then((response) => {
      expect(response.status).to.eq(200); 
      expect(response.body._id).to.eq(prodId); 
    });
  });
});

Then("Colocar o produto no carrinho", () => {
  cy.get('@token').then((token) => {
    cy.get('@prodId').then((prodId) => {
      cy.request({
        method: 'POST',
        url: `${url}/carrinhos`,
        headers: {
          Authorization: `Bearer ${token}`
        },
        body: {
          produtos: [
            {
              idProduto: prodId,
              quantidade: 1
            }
          ]
        }
      }).then((response) => {
        expect(response.status).to.eq(201);
        expect(response.body.message).to.eq('Cadastro realizado com sucesso');
        expect(response.body._id).to.exist;
      });
    });
  });
});


