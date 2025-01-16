const { defineConfig } = require("cypress");
const { beforeRunHook, afterRunHook } = require('cypress-mochawesome-reporter/lib');
const createBundler = require("@bahmutov/cypress-esbuild-preprocessor");
const { addCucumberPreprocessorPlugin } = require("@badeball/cypress-cucumber-preprocessor");
const createEsbuildPlugin = require("@badeball/cypress-cucumber-preprocessor/esbuild");

module.exports = defineConfig({
  reporter: "cypress-mochawesome-reporter",
  e2e: {
    async setupNodeEvents(on, config) {
      require("cypress-mochawesome-reporter/plugin")(on);

      const bundler = createBundler({
        plugins: [createEsbuildPlugin.default(config)],
      });

      on("file:preprocessor", bundler);
      await addCucumberPreprocessorPlugin(on, config);

      // Hooks personalizados
      on('before:run', async (details) => {
        console.log('Iniciando a execução dos testes...');
        await beforeRunHook(details);
      });

      on('after:run', async () => {
        console.log('Finalizando a execução dos testes e gerando relatório...');
        await afterRunHook();
      });

      return config;
    },
    
    reporterOptions: {
      reportDir: "cypress/reports", 
      overwrite: true,             
      html: true,                  
      json: true,                  
      charts: true,                
      embeddedScreenshots: true,   
      inlineAssets: true,          
    },
    specPattern: "**/cypress/Features/**/*.feature",
    baseUrl: "https://front.serverest.dev",
    apiBaseUrl: "https://serverest.dev",
    stepDefinitions: "cypress/support/step_definitions/**/*.{js,ts}",
  },
});
