const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { sequelize } = require('./models/model');
const routes = require('./routes');

const app = express();
app.use(bodyParser.json());
app.use(cors());
app.set('sequelize', sequelize);
app.set('models', sequelize.models);

app.use('/', routes);

module.exports = app;
