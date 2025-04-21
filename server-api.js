
import express from 'express';
import bodyParser from 'body-parser';
import mongodb from 'mongodb';
const { MongoClient, ObjectId } = mongodb;
import cors from 'cors';
import jwt from 'jsonwebtoken';

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Configuração do JWT
const JWT_SECRET = 'sua_chave_secreta_para_jwt';
const TOKEN_EXPIRATION = '24h';

// 🔗 Conexão com o MongoDB
const uri = 'mongodb://localhost:27017';
const client = new MongoClient(uri);
const dbName = 'generic-crud';
let db;

// 🌐 Conecta uma vez no MongoDB
client.connect().then(() => {
    db = client.db(dbName);
    console.log('🟢 Conectado ao MongoDB');
}).catch(err => {
    console.error('🔴 Erro ao conectar no MongoDB', err);
    process.exit(1);
});

// Middleware de verificação de token
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    
    if (!token) {
        return res.status(401).json({ error: 'Token de acesso não fornecido' });
    }
    
    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({ error: 'Token inválido ou expirado' });
        }
        req.user = user;
        next();
    });
};

// Rota de login para obter token
app.post('/login', async (req, res) => {
    const { username, password } = req.body;
    
    // Verificação simples - em produção, verificaria contra o banco de dados
    if (username === 'admin' && password === '123456') {
        const user = { id: 1, username };
        const token = jwt.sign(user, JWT_SECRET, { expiresIn: TOKEN_EXPIRATION });
        
        res.json({ 
            message: 'Autenticado com sucesso', 
            token,
            user: {
                id: user.id,
                username: user.username
            }
        });
    } else {
        res.status(401).json({ error: 'Credenciais inválidas' });
    }
});

// status api - pública
app.get('/ping', async (req, res) => {
    res.json({ message: 'Pong!' });
});

// Todas as rotas abaixo estão protegidas pelo middleware authenticateToken
// ✅ Criar
app.post('/:collectionName', authenticateToken, async (req, res) => {
    const collection = db.collection(req.params.collectionName);
    const result = await collection.insertOne(req.body);
    res.json({ insertedId: result.insertedId });
});

// 📥 Listar todos
app.get('/:collectionName', authenticateToken, async (req, res) => {
    const collection = db.collection(req.params.collectionName);

    const { page = 1, limit = 10, ...filters } = req.query;

    // Convert string para número
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);

    // Constrói filtro dinâmico (ex: { nome: "Joao" })
    const query = {};
    for (const key in filters) {
        query[key] = { $regex: filters[key], $options: 'i' }; // busca insensível a maiúsculas
    }

    const total = await collection.countDocuments(query);
    const data = await collection
        .find(query)
        .skip((pageNum - 1) * limitNum)
        .limit(limitNum)
        .toArray();

    res.json({
        total,
        page: pageNum,
        limit: limitNum,
        data
    });
});

// 🔎 Buscar por ID
app.get('/:collectionName/:id', authenticateToken, async (req, res) => {
    const collection = db.collection(req.params.collectionName);
    const data = await collection.findOne({ _id: new ObjectId(req.params.id) });
    res.json(data);
});

// ✏️ Atualizar por ID
app.put('/:collectionName/:id', authenticateToken, async (req, res) => {
    const collection = db.collection(req.params.collectionName);
    const body = { ...req.body, updatedAt: new Date() };
    delete body._id;

    const result = await collection.findOneAndUpdate(
        { _id: new ObjectId(req.params.id) },
        { $set: body },
        { returnDocument: 'after' }
    );
    res.json(result.value);
});

// ❌ Deletar por ID
app.delete('/:collectionName/:id', authenticateToken, async (req, res) => {
    const collection = db.collection(req.params.collectionName);
    await collection.deleteOne({ _id: new ObjectId(req.params.id) });
    res.json({ success: true });
});

// 🚀 Inicia servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 API ouvindo em http://localhost:${PORT}`);
});
