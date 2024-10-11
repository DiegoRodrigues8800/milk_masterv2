// controllers/VacaController.js
const Vaca = require('../models/vaca');
const Raca = require('../models/raca');
const Estado = require('../models/estado');
const { validationResult } = require('express-validator');

// Exibir lista de vacas
exports.listarVacas = async (req, res) => {
    try {
        const vacas = await Vaca.findAll({
            include: [
                { model: Raca }, { model: Estado },
            ]
        });
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
        const estados = await Estado.findAll();
        res.render('cadastrarVaca', { racas, estados, erros: null, dados: {} });
    } catch (error) {
        console.error(error);
        res.status(500).send('Erro ao carregar formulário.');
    }
};

exports.exibirConfig = async (req, res) => {
    try {
        res.render('config');
    } catch (error) {
        console.error(error);
        res.status(500).send('Erro ao carregar página.');
    }
};
// Processar cadastro de vaca
exports.cadastrarVaca = async (req, res) => {
    const { nome, idade, cod_raca, cod_estado } = req.body;

    // Validação básica
    let erros = [];
    if (!nome || nome.trim() === '') {
        erros.push({ msg: 'Nome é obrigatório.' });
    }
    if (!idade || isNaN(idade)) {
        erros.push({ msg: 'Idade deve ser um número válido.' });
    }
    if (!cod_raca || isNaN(cod_raca)) {
        erros.push({ msg: 'Raça é obrigatória.' });
    } else {
        // Verifique se a raça existe
        const racaExistente = await Raca.findByPk(cod_raca);
        if (!racaExistente) {
            erros.push({ msg: 'Raça selecionada não existe.' });
        }
    }

    if (!cod_estado || isNaN(cod_estado)) {
        erros.push({ msg: 'Estado é obrigatório.' });
    } else {
        // Verifique se o estado existe
        const estadoExistente = await Estado.findByPk(cod_estado);
        if (!estadoExistente) {
            erros.push({ msg: 'Estado selecionado não existe.' });
        }
    }

    if (erros.length > 0) {
        const racas = await Raca.findAll();
        const estados = await Estado.findAll();
        return res.render('cadastrarVaca', { racas, estados, erros, dados: req.body });
    }

    try {
        await Vaca.create({ nome, idade, cod_raca, cod_estado });
        res.redirect('/vacas');
    } catch (error) {
        console.error(error);
        res.status(500).send('Erro ao cadastrar vaca.');
    }
};

// Excluir vaca
exports.excluirVaca = async (req, res) => {
    const { idvaca } = req.params;
    try {
        await Vaca.destroy({ where: { idvaca } });
        res.redirect('/vacas');
    } catch (error) {
        console.error(error);
        res.status(500).send('Erro ao excluir vaca.');
    }
};
