const { Client, MessageEmbed } = require("discord.js");
const roledb = require("../schema/roledata");
const reactdb = require("../schema/reactMess");
/**
 * @param {Client} client
 */
module.exports = async (client) => {
  client.on("messageReactionAdd", async (react, user) => {
    console.log(react, user);
  });
  client.on("messageReactionRemove", async (react, user) => {
    console.log(react, user);
  });
};
