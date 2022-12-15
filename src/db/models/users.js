'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class users extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  users.init({
    name: DataTypes.STRING,
    birth: DataTypes.DATEONLY,
    usia: DataTypes.INTEGER,
    mobile: DataTypes.STRING,
    city: DataTypes.STRING,
    education: DataTypes.STRING,
    image: DataTypes.STRING,
    imageName: DataTypes.STRING,
  }, {
    sequelize,
    modelName: 'users',
  });
  return users;
};