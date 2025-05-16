const { Sequelize } = require("sequelize");
const sequelize = require("../config/database");
const Data = require("./data.model");

// Initialize models
const models = {
  Data,
};

// Export sequelize instance and models
module.exports = {
  sequelize,
  ...models,
};
