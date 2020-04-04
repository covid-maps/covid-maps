const { Sequelize } = require("sequelize");
const db = require("../models");

const sequelize = new Sequelize("postgres://localhost:5432/covid_maps_0");

(async () => {
  await sequelize.authenticate();
  const User = db.User;

  await User.create({ firstName: "test", lastName: "test" });
  console.log(await User.findAll());

  await sequelize.close();
})();
