const { CommandInteraction, Client } = require("discord.js");
const { SlashCommandBuilder } = require("@discordjs/builders");
const logsguild = require("../../schema/logsguild");
module.exports = {
  permission: "ADMINISTRATOR",
  developersOnly: false,
  data: new SlashCommandBuilder()
    .setName("del")
    .setDescription("Xoá Gang/Nhóm ra Hệ thống")
    .addStringOption((option) => {
      return option
        .setName("type")
        .setDescription("Gang/Nhóm")
        .setRequired(true)
        .addChoices(
          { name: "Nhóm", value: "nhom" },
          { name: "Gang", value: "gang" },
        );
    })
    .addStringOption((option) => {
      return option
        .setName("name")
        .setDescription("Tên Gang/Nhóm")
        .setRequired(true);
    }),
  /**
   * @param {CommandInteraction} interaction
   * @param {Client} client
   */
  async execute(interaction, client) {},
};
