const { CommandInteraction, MessageEmbed, Client } = require("discord.js");
const { SlashCommandBuilder } = require("@discordjs/builders");
const messlogs = require("../../schema/messlog");
module.exports = {
  permission: "ADMINISTRATOR",
  developersOnly: false,
  data: new SlashCommandBuilder()
    .setName("messlog")
    .setDescription("Log tin nhắn của tất cả thành viên edit/delete")
    .addChannelOption((v) => {
      return v
        .setName("channel")
        .setDescription("Channel Logs")
        .setRequired(true);
    }),
  /**
   * @param {CommandInteraction} interaction
   * @param {Client} client
   */
  async execute(interaction, client) {
    var mlog = interaction.options.get("channel");
    await messlogs.findOneAndUpdate(
      {
        guildId: `${interaction.guildId}`,
      },
      {
        $set: {
          chLog: `${mlog.value}`,
        },
      },
      {
        upsert: true,
        new: true,
      },
    );
    interaction.reply({
      content: "Bạn đã cập nhập thành công Channel Mess Logs !",
      ephemeral: true,
    });
  },
};
