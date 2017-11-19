'use strict'

// IMPORT EXPRESS & DB+MODELS
const express = require('express');
const db = require('../models')
const Page = db.models.page;
const User = db.models.user;

// CREATE NEW ROUTER
const router = express.Router();

// SET UP ROUTES
router.get('/', (req, res, next) => {
  User.findAll()
  .then(users => res.render('users', {
    users: users
  }))
  .catch(next);
})

router.get('/:id/', (req, res, next) => {
  User.findOne({
    where: {
      id: req.params.id
    },
    include: [Page]
  })
  .then(user => res.render('userpage', {
    user: user
  }))
  .catch(next);
})

// EXPORT ROUTER
module.exports = router;
