const { CommandInteraction, MessageEmbed, Client } = require("discord.js");
const { SlashCommandBuilder } = require("@discordjs/builders");
const guildEvents = require("../../schema/GuildAdd");
module.exports = {
  permission: "ADMINISTRATOR",
  developersOnly: false,
  data: new SlashCommandBuilder()
    .setName("guildadd")
    .setDescription(
      "Tự động thiết lập vai trò và chào mừng khi có thành viên mới tham gia",
    )
    .addChannelOption((option) => {
      return option
        .setName("join")
        .setDescription("Chọn Channel thông báo khi member tham gia")
        .setRequired(true);
    })
    .addChannelOption((option) => {
      return option
        .setName("leave")
        .setDescription("Chọn Channel thông báo khi member rời")
        .setRequired(true);
    })
    .addChannelOption((option) => {
      return option
        .setName("logs")
        .setDescription("Logs Channel Member Join/Leave")
        .setRequired(true);
    })
    .addRoleOption((option) => {
      return option
        .setName("roles")
        .setDescription("Chọn Role để tự động cấp khi member tham gia");
    }),
  /**
   * @param {CommandInteraction} interaction
   * @param {Client} client
   */
  async execute(interaction, client) {
    var join = interaction.options.get("join");
    var leave = interaction.options.get("leave");
    var roles = interaction.options.get("roles");
    var logs = interaction.options.get("logs");
    await guildEvents.findOneAndUpdate(
      {
        guildId: interaction.guildId,
      },
      {
        $set: {
          ch_join: join.value,
          ch_leave: leave.value,
          chLog: logs.value,
          role: roles.value,
        },
      },
      {
        upsert: true,
        new: true,
      },
    );
    interaction.reply({
      content: "Bạn đã setup thành công !",
      ephemeral: true,
    });
  },
};
