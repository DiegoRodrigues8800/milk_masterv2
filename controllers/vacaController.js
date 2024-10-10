// controllers/VacaController.js
const Vaca = require('../models/vaca');
const Raca = require('../models/raca');
const { validationResult } = require('express-validator');

// Exibir lista de vacas
exports.listarVacas = async (req, res) => {
    try {
        const vacas = await Vaca.findAll({ include: Raca });
        res.render('listarVaca', { vacas });
    } catch (error) {
        console.error(error);
        res.status(500).send('Erro ao listar vacas.');
    }
};

// Exibir formulário de cadastro
exports.exibirFormularioCadastro = async (req, res) => {
    try {
        const racas = await Raca.findAll();
        res.render('cadastrarVaca', { racas, erros: null, dados: {} });
    } catch (error) {
        console.error(error);
        res.status(500).send('Erro ao carregar formulário.');
    }
};

// Processar cadastro de vaca
exports.cadastrarVaca = async (req, res) => {
    const { nome, idade, racaId } = req.body;

    // Validação básica
    let erros = [];
    if (!nome || nome.trim() === '') {
        erros.push({ msg: 'Nome é obrigatório.' });
    }
    if (!idade || isNaN(idade)) {
        erros.push({ msg: 'Idade deve ser um número válido.' });
    }
    if (!racaId || isNaN(racaId)) {
        erros.push({ msg: 'Raça é obrigatória.' });
    } else {
        // Verifique se a raça existe
        const racaExistente = await Raca.findByPk(racaId);
        if (!racaExistente) {
            erros.push({ msg: 'Raça selecionada não existe.' });
        }
    }

    if (erros.length > 0) {
        const racas = await Raca.findAll();
        return res.render('cadastrarVaca', { racas, erros, dados: req.body });
    }

    try {
        await Vaca.create({ nome, idade, racaId });
        res.redirect('/vacas');
    } catch (error) {
        console.error(error);
        res.status(500).send('Erro ao cadastrar vaca.');
    }
};

// Excluir vaca
exports.excluirVaca = async (req, res) => {
    const { id } = req.params;
    try {
        await Vaca.destroy({ where: { id } });
        res.redirect('/vacas');
    } catch (error) {
        console.error(error);
        res.status(500).send('Erro ao excluir vaca.');
    }
};
