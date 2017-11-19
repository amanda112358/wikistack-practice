'use strict'

// IMPORT SEQUELIZE + DB
const Sequelize = require('sequelize');
const db = new Sequelize('postgres://localhost:5432/wikistack-practice', {logging: false});

// DEFINE MODELS

const Page = db.define('page', {
  title: {
    type: Sequelize.STRING,
    allowNull: false
  },
  urlTitle: {
    type: Sequelize.STRING,
    allowNull: false,
    unique: true
  },
  content: {
    type: Sequelize.TEXT,
    allowNull: false
  },
  status: {
    type: Sequelize.ENUM('open', 'closed')
  },
  date: {
    type: Sequelize.DATE,
    defaultValue: Sequelize.NOW
  },
  route: {
    type: Sequelize.VIRTUAL,
    get() {
      return `/wiki/${this.urlTitle}`;
    }
  },
  tags: {
    type: Sequelize.ARRAY(Sequelize.STRING),
    set: function(tags){

      tags = tags || [];

      if (typeof tags === 'string'){
        tags = tags.split(',').map(str => str.trim());
      }
      this.setDataValue('tags', tags);
    }
    // get() {
    //   return this.getDataValue('tags').join(' | ')
    // }
  }
});

const User = db.define('user', {
  name: {
    type: Sequelize.STRING,
    allowNull: false
    // validate: {
    //   notNull: true
    // }
  },
  email: {
    type: Sequelize.STRING,
    allowNull: false,
    validate: {
      isEmail: true
    }
  }
});


// MODEL ASSOCIATIONS
Page.belongsTo(User, {as: 'author'});
User.hasMany(Page, {foreignKey: 'authorId'})


// HOOKS
Page.hook('beforeValidate', function (page) {
  if (page.title) {
      page.urlTitle = page.title.replace(/\s/g, '_').replace(/\W/g, '');
  } else {
      page.urlTitle = Math.random().toString(36).substring(2, 7);
  }
});

// CLASS & INSTANCE METHODS
Page.findByTag = function(tag){
  return Page.findAll({
    where: {
      tags: {
        $overlap: [tag]
      }
    }
  })
}

Page.prototype.findSimilar = function(){
  return Page.findAll({
    where: {
      tags: {
        $overlap: this.tags,
      },
      id: {
        $ne: this.id
      }
    },
    include: [{model: User, as: 'author'}]
  });
}

// EXPORT DB
module.exports = db;
