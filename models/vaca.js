// models/Vaca.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Vaca = sequelize.define('Vaca', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    nome: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    idade: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    racaId: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
}, {
    tableName: 'vacas',
    timestamps: false,
});

module.exports = Vaca;
