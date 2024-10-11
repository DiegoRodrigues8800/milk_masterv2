// routes/vacas.js
const express = require('express');
const router = express.Router();
const VacaController = require('../controllers/vacaController');
const { config } = require('dotenv');

// Rota para listar vacas
router.get('/', VacaController.listarVacas);

// Rota para exibir formulário de cadastro
router.get('/cadastrar', VacaController.exibirFormularioCadastro);

// Rota para processar o cadastro
router.post('/cadastrar', VacaController.cadastrarVaca);

// Rota para excluir uma vaca
router.post('/excluir/:idvaca', VacaController.excluirVaca);

// Rota para tela de configuração do sistema
router.get('/config', VacaController.exibirConfig);

module.exports = router;
