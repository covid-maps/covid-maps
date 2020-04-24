const assert = require("assert");
const models = require("../models");

async function addVote(data) {
  assert(data.type === "up" || data.type === "down");
  return await models.Votes.create(data);
}

async function votesForUpdate(updateId) {
  const up = await models.Votes.count({
    where: {
      updateId,
      type: "up",
    },
  });
  const down = await models.Votes.count({
    where: {
      updateId,
      type: "down",
    },
  });
  return { up, down };
}

module.exports = {
  addVote,
  votesForUpdate,
};
