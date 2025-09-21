const { Sequelize } = require('sequelize');

// This is the most important part.
// process.env.DATABASE_URL is how your code will read the variable we set on Render.
// For now, you can paste your copied URL directly for local testing if you want,
// but the process.env part is what matters for deployment.
const dbUrl = process.env.DATABASE_URL;

if (!dbUrl) {
  throw new Error("DATABASE_URL environment variable is not set!");
}

// Sequelize can connect directly using the full URL string.
const sequelize = new Sequelize(dbUrl, {
  dialect: 'mysql',
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false // Railway requires this setting
    }
  }
});

module.exports = sequelize;