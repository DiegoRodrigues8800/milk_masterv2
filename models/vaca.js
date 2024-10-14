// models/Vaca.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Vaca = sequelize.define('Vaca', {
    idvaca: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    nome: {
        type: DataTypes.STRING,
        allowNull: false
    },
    idade: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    cod_raca: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    cod_estado: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
}, {
    tableName: 'vaca',
    timestamps: false
});

module.exports = Vaca;
