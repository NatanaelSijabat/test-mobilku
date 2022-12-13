require('dotenv').config();
module.exports = {
  "development": {
    "username": process.env.DB_USER,
    "password": process.env.DB_PASSWORD,
    "database": process.env.DB_NAME,
    "host": process.env.DB_HOST,
    "dialect": "mysql"
  },
  "test": {
    "username": "root",
    "password": null,
    "database": "database_test",
    "host": "127.0.0.1",
    "dialect": "mysql"
  },
  "production": {
    "username": process.env.DB_USERNAME_API,
    "password": process.env.DB_PASSWORD_API,
    "database": process.env.DB_NAME_API,
    "host": process.env.DB_HOSTNAME_API,
    "dialect": "mysql"
  }
};