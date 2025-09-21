const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Uloga extends Model {
    static associate(models) {
      // Junction tables often don't need associations defined here
    }
  }
  Uloga.init({
    Id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    PredstavaId: DataTypes.INTEGER,
    GlumacId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Uloga',
    tableName: 'Uloga',
    timestamps: false
  });
  return Uloga;
};