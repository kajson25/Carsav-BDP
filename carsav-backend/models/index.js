const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const basename = path.basename(__filename);

// Import the database connection configuration
const sequelize = require('../database/config');
const db = {};

// Read all files from the current directory (the 'models' folder)
fs
  .readdirSync(__dirname)
  .filter(file => {
    // We want all .js files that are not this file itself
    return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js');
  })
  .forEach(file => {
    // For each model file, initialize it and add it to our db object
    const model = require(path.join(__dirname, file))(sequelize, Sequelize.DataTypes);
    db[model.name] = model;
  });

// Now, associate all the models
Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

// Export the connection and all models
db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;