
import express from 'express';
import bodyParser from 'body-parser';
import mongodb from 'mongodb';
const { MongoClient, ObjectId } = mongodb;
import cors from 'cors';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';

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

app.post('/register', async (req, res) => {
  const { email, password, nome } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'E-mail e senha são obrigatórios' });
  }

  const users = db.collection('users');
  const existing = await users.findOne({ email });

  if (existing) {
    return res.status(409).json({ error: 'E-mail já cadastrado' });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const result = await users.insertOne({
    email,
    password: hashedPassword,
    nome,
    createdAt: new Date()
  });

  res.json({ userId: result.insertedId });
});

// Rota de login para obter token
app.post('/login', async (req, res) => {
  const { email, password } = req.body;

  const users = db.collection('users');
  const user = await users.findOne({ email });

  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(401).json({ error: 'E-mail ou senha inválidos' });
  }

  const token = jwt.sign(
    { id: user._id.toHexString(), email: user.email },
    JWT_SECRET,
    { expiresIn: TOKEN_EXPIRATION }
  );

  res.json({
    message: 'Autenticado com sucesso',
    token,
    user: { id: user._id, email: user.email, nome: user.nome }
  });
});

app.post('/forgot-password', async (req, res) => {
  const { email } = req.body;
  const users = db.collection('users');
  const user = await users.findOne({ email });

  if (!user) {
    return res.status(404).json({ error: 'E-mail não encontrado' });
  }

  const resetToken = jwt.sign({ id: user._id.toHexString() }, JWT_SECRET, {
    expiresIn: '15m'
  });

  // Aqui você mandaria por e-mail — por enquanto só retorna no response:
  res.json({ message: 'Token de recuperação gerado', resetToken });
});

app.put('/change-password', authenticateToken, async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  const users = db.collection('users');
  const user = await users.findOne({ _id: new ObjectId(req.user.id) });

  if (!user || !(await bcrypt.compare(currentPassword, user.password))) {
    return res.status(403).json({ error: 'Senha atual incorreta' });
  }

  const hashedNew = await bcrypt.hash(newPassword, 10);

  await users.updateOne(
    { _id: user._id },
    { $set: { password: hashedNew, updatedAt: new Date() } }
  );

  res.json({ message: 'Senha alterada com sucesso' });
});

app.post('/reset-password', async (req, res) => {
  const { resetToken, newPassword } = req.body;

  try {
    const decoded = jwt.verify(resetToken, JWT_SECRET);
    const users = db.collection('users');

    const hashedNew = await bcrypt.hash(newPassword, 10);

    await users.updateOne(
      { _id: new ObjectId(decoded.id) },
      { $set: { password: hashedNew, updatedAt: new Date() } }
    );

    res.json({ message: 'Senha redefinida com sucesso' });
  } catch (err) {
    res.status(400).json({ error: 'Token inválido ou expirado' });
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
