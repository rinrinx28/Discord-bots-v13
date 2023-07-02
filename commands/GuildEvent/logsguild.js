const { CommandInteraction, Client } = require("discord.js");
const { SlashCommandBuilder } = require("@discordjs/builders");
const logsguild = require("../../schema/logsguild");
module.exports = {
  permission: "ADMINISTRATOR",
  developersOnly: false,
  data: new SlashCommandBuilder()
    .setName("logsguild")
    .setDescription("Tạo Logs Guild")
    .addStringOption((option) => {
      return option
        .setName("logsname")
        .setDescription("Logs Name")
        .setRequired(true);
    })
    .addChannelOption((option) => {
      return option
        .setName("channellogs")
        .setDescription("Channel Logs")
        .setRequired(true);
    }),
  /**
   * @param {CommandInteraction} interaction
   * @param {Client} client
   */
  async execute(interaction, client) {
    let channellogs = interaction.options.getChannel("channellogs").id;
    let logstype = interaction.options.getString("logsname");
    await logsguild.findOneAndUpdate(
      {
        guilid: interaction.guildId,
        logstype: logstype,
      },
      {
        $set: {
          logstype: logstype,
          channellogs: channellogs,
        },
      },
      {
        upsert: true,
        new: true,
      },
    );
    return await interaction.reply({
      content: `Bạn đã thêm Log **${logstype}** Guild Thành Công.`,
    });
  },
};
