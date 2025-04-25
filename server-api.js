
const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Enable CORS
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

// Mock data stores
const clients = [];
const plans = [];
const events = [];
const kits = [];
const themes = [];

// Generate unique IDs
const generateId = () => Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);

// Generic CRUD API generator
const createCrudEndpoints = (router, resourceName, dataStore) => {
  // GET all resources
  router.get(`/${resourceName}`, (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const results = dataStore.slice(startIndex, endIndex);

    res.json({
      data: results,
      page: page,
      limit: limit,
      total: dataStore.length
    });
  });

  // GET resource by ID
  router.get(`/${resourceName}/:id`, (req, res) => {
    const item = dataStore.find(item => item.id === req.params.id);
    if (!item) {
      return res.status(404).json({ error: `${resourceName.slice(0, -1)} not found` });
    }
    res.json(item);
  });

  // POST new resource
  router.post(`/${resourceName}`, (req, res) => {
    // Validate required fields based on resource type
    if (resourceName === 'clients' && (!req.body.name || !req.body.email)) {
      return res.status(400).json({ error: 'Nome e email são obrigatórios' });
    }
    
    // Check for duplicates (for clients using email)
    if (resourceName === 'clients' && dataStore.some(item => item.email === req.body.email)) {
      return res.status(400).json({ error: 'Um cliente com este email já existe' });
    }

    const newItem = {
      id: generateId(),
      ...req.body,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    dataStore.push(newItem);
    res.status(201).json(newItem);
  });

  // PUT update resource
  router.put(`/${resourceName}/:id`, (req, res) => {
    const index = dataStore.findIndex(item => item.id === req.params.id);
    if (index === -1) {
      return res.status(404).json({ error: `${resourceName.slice(0, -1)} not found` });
    }
    
    const updatedItem = {
      ...dataStore[index],
      ...req.body,
      updatedAt: new Date().toISOString()
    };
    
    dataStore[index] = updatedItem;
    res.json(updatedItem);
  });

  // DELETE resource
  router.delete(`/${resourceName}/:id`, (req, res) => {
    const index = dataStore.findIndex(item => item.id === req.params.id);
    if (index === -1) {
      return res.status(404).json({ error: `${resourceName.slice(0, -1)} not found` });
    }
    
    const deletedItem = dataStore.splice(index, 1)[0];
    res.json({ success: true, data: deletedItem });
  });
};

// Create CRUD endpoints for each resource
createCrudEndpoints(app, 'clients', clients);
createCrudEndpoints(app, 'plans', plans);
createCrudEndpoints(app, 'events', events);
createCrudEndpoints(app, 'kits', kits);
createCrudEndpoints(app, 'themes', themes);

// Start server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

// Export for testing
module.exports = app;
