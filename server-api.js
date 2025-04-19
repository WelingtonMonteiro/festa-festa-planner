import express from 'express';
import bodyParser from 'body-parser';
import mongodb from 'mongodb';
const { MongoClient, ObjectId } = mongodb;
import cors from 'cors';

const app = express();
app.use(cors());
app.use(bodyParser.json());

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

// statu api
app.get('/ping', async (req, res) => {
    res.json({ message: 'Pong!' });
});

// ✅ Criar
app.post('/:collectionName', async (req, res) => {
    const collection = db.collection(req.params.collectionName);
    const result = await collection.insertOne(req.body);
    res.json({ insertedId: result.insertedId });
});

// 📥 Listar todos
app.get('/:collectionName', async (req, res) => {
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
app.get('/:collectionName/:id', async (req, res) => {
    const collection = db.collection(req.params.collectionName);
    const data = await collection.findOne({ _id: new ObjectId(req.params.id) });
    res.json(data);
});

// ✏️ Atualizar por ID
app.put('/:collectionName/:id', async (req, res) => {
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
app.delete('/:collectionName/:id', async (req, res) => {
    const collection = db.collection(req.params.collectionName);
    await collection.deleteOne({ _id: new ObjectId(req.params.id) });
    res.json({ success: true });
});

// 🚀 Inicia servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 API ouvindo em http://localhost:${PORT}`);
});
