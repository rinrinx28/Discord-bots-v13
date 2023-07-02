const { CommandInteraction, Client } = require("discord.js");
const auto = require("../../schema/auto");
const { SlashCommandBuilder } = require("@discordjs/builders");
module.exports = {
  permission: "ADMINISTRATOR",
  developersOnly: false,
  data: new SlashCommandBuilder()
    .setName("makeauto")
    .setDescription("Tạo Auto Check Cho Guild")
    .addChannelOption((option) => {
      return option
        .setName("channellogs")
        .setDescription("Channel Logs Auto Check")
        .setRequired(true);
    }),
  /**
   * @param {CommandInteraction} interaction
   * @param {Client} client
   */
  async execute(interaction, client, ws) {},
};
