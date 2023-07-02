const { CommandInteraction, MessageEmbed, Client } = require("discord.js");
const { SlashCommandBuilder } = require("@discordjs/builders");
const voicedb = require("../../schema/voicelog");
module.exports = {
  permission: "ADMINISTRATOR",
  developersOnly: false,
  data: new SlashCommandBuilder()
    .setName("voicelog")
    .setDescription("Log voice tất cả thành viên")
    .addChannelOption((v) => {
      return v
        .setName("channel")
        .setDescription("Channel Logs Voice")
        .setRequired(true);
    })
    .addChannelOption((v) => {
      return v
        .setName("makevoice")
        .setDescription("Nơi tạo room (Channel tạo Room)")
        .setRequired(true);
    })
    .addChannelOption((v) => {
      return v
        .setName("parent")
        .setDescription("Category của Channel tạo room")
        .setRequired(true);
    }),
  /**
   * @param {CommandInteraction} interaction
   * @param {Client} client
   */
  async execute(interaction, client) {
    var q1 = interaction.options.get("channel");
    var q2 = interaction.options.get("makevoice");
    var q3 = interaction.options.get("parent");
    await voicedb.findOneAndUpdate(
      {
        guildId: `${interaction.guildId}`,
      },
      {
        $set: {
          chLog: `${q1.value}`,
          j2t: `${q2.value}`,
          parentj2t: `${q3.value}`,
        },
      },
      {
        upsert: true,
        new: true,
      },
    );
    interaction.reply({
      content: "Bạn đã cập nhập thành công Voice Log !",
      ephemeral: true,
    });
  },
};
