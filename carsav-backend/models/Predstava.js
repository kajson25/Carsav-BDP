const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Predstava extends Model {
    static associate(models) {
      // ADD THE 'as' PROPERTY HERE
      this.belongsToMany(models.Glumac, {
        through: models.Uloga,
        foreignKey: 'PredstavaId',
        otherKey: 'GlumacId',
        as: 'glumci' // This forces the creation of getGlumci, setGlumci, etc.
      });
    }
  }
  Predstava.init({
    Id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    Naziv: { type: DataTypes.STRING, allowNull: false, unique: true }
  }, {
    sequelize,
    modelName: 'Predstava',
    tableName: 'Predstava',
    timestamps: false
  });
  return Predstava;
};