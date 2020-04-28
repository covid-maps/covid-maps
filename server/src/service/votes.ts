const assert = require("assert");
const models = require("../models");

export async function addVote(data) {
  assert(data.type === "up" || data.type === "down");
  return await models.Votes.create(data);
}
