// models/Raca.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Raca = sequelize.define('Raca', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    nome: {
        type: DataTypes.STRING,
        allowNull: false,
    },
}, {
    tableName: 'racas',
    timestamps: false,
});

module.exports = Raca;
