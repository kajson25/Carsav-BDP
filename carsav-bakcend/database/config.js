const { Sequelize } = require('sequelize');

// Create a new Sequelize instance.
// new Sequelize('database_name', 'username', 'password', { ...options });
const sequelize = new Sequelize('deki_db', 'kajson', 'admin', {
  host: 'localhost',
  dialect: 'mysql'
});

module.exports = sequelize