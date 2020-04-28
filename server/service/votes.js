const assert = require("assert");
const models = require("../models");

async function addVote(data) {
  assert(data.type === "up" || data.type === "down");
  return await models.Votes.create(data);
}
async function deleteVote({ type, ip, updateId }) {
  const instance = await models.Votes.findOne({
    where: { type, ip, updateId },
  });
  if (instance) {
    instance.destroy();
  }
  return {};
}

module.exports = {
  addVote,
  deleteVote,
};
