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
  res.redirect('/');
});

router.get('/add/', (req, res, next) => {
  res.render('addpage');
});

router.get('/search/', (req, res, next) => {
  const tagQuery = req.query.tags;
  if (tagQuery) res.redirect(`/wiki/tags/${tagQuery}`);
  else res.render('search');
});

router.get('/tags/:tag', (req, res, next) => {
  Page.findByTag(req.params.tag)
  .then(pages => {
    res.render('index', {
      pages: pages
    });
  })
  .catch(next);
});

router.post('/', (req, res, next) => {

  User.findOrCreate({
    where: {
      name: req.body.name,
      email: req.body.email
    }
  })
  .then(values => {
    const user = values[0];

    Page.create(req.body)
    .then(page => {
      return page.setAuthor(user);
    })
    .then(page => {
      res.redirect(page.route);
    })
    .catch(next);
  })

});

router.get('/:urlTitle', (req, res, next) => {
  Page.findOne({
    where: {
      urlTitle: req.params.urlTitle
    },
    include: [{model: User, as: 'author'}]
  })
  .then((page) => {
    res.render('wikipage', {
      page: page
    });
  })
  .catch(next);
})

router.get('/:urlTitle/similar', (req, res, next) => {
  Page.findOne({
    where: {
      urlTitle: req.params.urlTitle
    }
  })
  .then((page) => {
    return page.findSimilar();
  })
  .then(pages => {
    res.render('index', {
      pages: pages
    });
  })
  .catch(next);
});

router.get('/:urlTitle/delete', (req, res, next) => {
  Page.destroy({
    where: {
      urlTitle: req.params.urlTitle
    }
  })
  .then(() => {
    res.redirect('/');
  })
  .catch(next);
});

router.get('/:urlTitle/edit', (req, res, next) => {
  Page.findOne({
    where: {
      urlTitle: req.params.urlTitle
    },
    include: [{model: User, as: 'author'}]
  })
  .then(page => {
    res.render('editpage', {
      page: page
    });
  })
  .catch(next);
});

router.post('/:urlTitle', (req, res, next) => {
  Page.update(
    req.body, {
      where: {
        urlTitle: req.params.urlTitle
      },
      returning: true
    }
  )
  .then(values => {
    console.log(values);
    const updatedPage = values[1][0];
    res.redirect(updatedPage.route);
  })
});

// EXPORT ROUTER
module.exports = router;
