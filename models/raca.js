// models/raca.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Raca = sequelize.define('Raca', {
    idraca: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    nome: {
        type: DataTypes.STRING,
        allowNull: false,
    },
}, {
    tableName: 'raca',
    timestamps: false,
});

module.exports = Raca;
