'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class User extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
        }
    }
    User.init({
        nama: DataTypes.STRING,
        tanggal_lahir: DataTypes.DATEONLY,
        usia: DataTypes.INTEGER,
        no_wa: DataTypes.STRING,
        asal_kota: DataTypes.STRING,
        pendidikan_terakhir: DataTypes.STRING,
        foto: DataTypes.STRING
    }, {
        sequelize,
        modelName: 'User',
        underscored: true,
    });
    return User;
};
