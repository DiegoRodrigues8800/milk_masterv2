// models/index.js
const sequelize = require('../config/database');
const Vaca = require('./vaca');
const Raca = require('./raca');
const Estado = require('./estado');

// Definir associações
Vaca.belongsTo(Raca, { foreignKey: 'cod_raca' });
Raca.hasMany(Vaca, { foreignKey: 'cod_raca' });

Vaca.belongsTo(Estado, { foreignKey: 'cod_estado' });
Estado.hasMany(Vaca, { foreignKey: 'cod_estado' });

const db = {
    sequelize,
    Vaca,
    Raca,
    Estado,
};

module.exports = db;
