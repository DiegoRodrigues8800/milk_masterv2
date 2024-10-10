// models/index.js
const sequelize = require('../config/database');
const Vaca = require('./vaca');
const Raca = require('./raca');

// Definir associações
Vaca.belongsTo(Raca, { foreignKey: 'racaId' });
Raca.hasMany(Vaca, { foreignKey: 'racaId' });

const db = {
    sequelize,
    Vaca,
    Raca,
};

module.exports = db;
