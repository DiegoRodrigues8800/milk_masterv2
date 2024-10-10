// Importando dependências
const express = require('express');
const path = require('path');
const dotenv = require('dotenv');
const morgan = require('morgan');

// Carregar variáveis de ambiente
dotenv.config();

// Inicializando o aplicativo Express
const app = express();

// Middleware para logs de requisições
app.use(morgan('dev'));

// Middleware para interpretar dados do corpo das requisições
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Configurar a engine de templates EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middleware para servir arquivos estáticos
app.use(express.static(path.join(__dirname, 'public')));

// Importando configuração do banco de dados e modelos
const sequelize = require('./config/database');
const Vaca = require('./models/vaca');
const Raca = require('./models/raca');

// Definindo associações entre os modelos
Vaca.belongsTo(Raca, { foreignKey: 'racaId' });
Raca.hasMany(Vaca, { foreignKey: 'racaId' });

// Sincronizando com o banco de dados
sequelize.authenticate()
    .then(() => {
        console.log('Conexão com o banco de dados estabelecida com sucesso.');
        return sequelize.sync(); // Sincroniza os modelos
    })
    .then(() => {
        console.log('Modelos sincronizados com o banco de dados.');
    })
    .catch(err => {
        console.error('Erro ao conectar com o banco de dados:', err);
    });

// Rota principal
app.get('/', (req, res) => {
    res.render('index', { titulo: 'ERP de Vacas Leiteiras' });
});

// JSON de todas as vacas cadastradas
app.get('/api/vacas', async (req, res) => {
    const query = 'SELECT * FROM vaca'; // Substitua pelo nome da sua tabela

    try {
        const [results, metadata] = await sequelize.query(query);
        // O 'results' contém os dados e 'metadata' contém informações sobre a consulta

        res.json(results); // Retorna os resultados como JSON
    } catch (err) {
        console.error('Erro ao consultar o banco de dados:', err);
        return res.status(500).json({ error: 'Erro ao consultar o banco de dados' });
    }
});


// Importando e utilizando rotas para vacas
const vacasRouter = require('./routes/vaca');
app.use('/vacas', vacasRouter);

// Iniciar o servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
