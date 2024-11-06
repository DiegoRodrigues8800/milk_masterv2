// routes/financeiro.js
const express = require('express');
const router = express.Router();

// Rota para exibir a página de financeiro
router.get('/', (req, res) => {
    res.render('financeiro', { erros: null, dados: {}, mensagemSucesso: null });
});

module.exports = router;
