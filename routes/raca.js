// routes/vacas.js
const express = require('express');
const router = express.Router();
const RacaController = require('../controllers/racaController');
const { config } = require('dotenv');

// Rota para exibir formulário de cadastro
router.get('/cadastrar', RacaController.exibirCadastro);

// Rota para processar o cadastro
router.post('/cadastrar', RacaController.cadastrarRaca);

module.exports = router;
