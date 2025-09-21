const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Glumac extends Model {
    static associate(models) {
      // ADD THE 'as' PROPERTY HERE
      this.belongsToMany(models.Predstava, {
        through: models.Uloga,
        foreignKey: 'GlumacId',
        otherKey: 'PredstavaId',
        as: 'predstave' // This creates getPredstave, setPredstave, etc.
      });
    }
  }
  Glumac.init({
    Id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    Ime: { type: DataTypes.STRING, allowNull: false },
    Prezime: { type: DataTypes.STRING, allowNull: false }
  }, {
    sequelize,
    modelName: 'Glumac',
    tableName: 'Glumac',
    timestamps: false
  });
  return Glumac;
};