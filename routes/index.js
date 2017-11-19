'use strict'

// IMPORT EXPRESS & DB+MODELS
const express = require('express');
const db = require('../models')
const Page = db.models.page;
const User = db.models.user;
const wikiRouter = require('./wiki');
const userRouter = require('./users');

// CREATE NEW ROUTER
const router = express.Router();

// HOMEPAGE
router.get('/', (req, res, next) => {
  Page.findAll({
    include: [{model: User, as: 'author'}]
  })
  .then(pages => {
    res.render('index', {
      pages: pages
    });
  })
  .catch(next);
})

// SET UP ROUTES
router.use('/wiki/', wikiRouter);
router.use('/users/', userRouter);

// EXPORT ROUTER
module.exports = router;

