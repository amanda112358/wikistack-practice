'use strict'

// IMPORT MODULES
const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const nunjucks = require('nunjucks');
const path = require('path');
const db = require('./models');
const router = require('./routes');

// INSTANTIATE NEW EXPRESS APP
const app = express();

// SET UP NUNJUCKS
app.set('view engine', 'html');
app.engine('html', nunjucks.render);
nunjucks.configure('views', {noCache: true});

// PLUG IN MIDDLEWARE
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(path.join(__dirname, './public')));


// SET UP ROUTER
app.use('/', router);

// SET UP ERROR-HANDLER
app.use((err, req, res, next) => {
  console.log(err);
  res.send('ERROR: ' + err.message || 'Intenal Error');
})

// SYNC DB => START SERVER
db.sync()
.then(() => {
  app.listen(3000, console.log('Listening on port 3000.'))
})
