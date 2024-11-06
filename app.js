// app.js

// Importando dependências
const express = require('express');
const path = require('path');
const dotenv = require('dotenv');
const morgan = require('morgan');
const http = require('http'); // Importando http
const { Server } = require('socket.io');

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
const Estado = require('./models/estado');

// Definindo associações entre os modelos
Vaca.belongsTo(Raca, { foreignKey: 'cod_raca' });
Raca.hasMany(Vaca, { foreignKey: 'cod_raca' });

Vaca.belongsTo(Estado, { foreignKey: 'cod_estado' });
Estado.hasMany(Vaca, { foreignKey: 'cod_estado' });

// Criando o servidor HTTP e a instância do Socket.IO
const server = http.createServer(app);
const io = new Server(server);

// Tornar o objeto `io` disponível nos controladores via `app.locals`
app.locals.io = io;

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

// Importando e utilizando rotas para Raças
const racasRouter = require('./routes/raca');
app.use('/racas', racasRouter);

// Importando e utilizando rotas para financeiro
const financeiroRouter = require('./routes/financeiro');
app.use('/financeiro', financeiroRouter);


// Lidar com o evento de conexão do Socket.IO
io.on('connection', (socket) => {
    console.log('Um usuário se conectou');

    // Você pode adicionar mais eventos aqui conforme necessário
});

// Rota para cadastrar uma vaca
app.post('/vacas', async (req, res) => {
    const { nome, cod_raca, cod_estado } = req.body;

    try {
        const novaVaca = await Vaca.create({ nome, cod_raca, cod_estado });

        // Emitir notificação de sucesso via Socket.IO
        io.emit('notification', {
            message: `A vaca ${novaVaca.nome} foi cadastrada com sucesso!`,
            type: 'success'
        });

        res.status(201).json(novaVaca);
    } catch (error) {
        // Emitir notificação de erro via Socket.IO
        io.emit('notification', {
            message: `Erro ao cadastrar a vaca: ${error.message}`,
            type: 'danger' // Usar 'danger' para erros no Bootstrap
        });

        res.status(500).json({ error: 'Erro ao cadastrar a vaca.' });
    }
});

// Iniciar o servidor
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
