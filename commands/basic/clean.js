const { CommandInteraction, MessageEmbed, Client } = require("discord.js");
const { SlashCommandBuilder } = require("@discordjs/builders");
module.exports = {
  permission: "ADMINISTRATOR",
  developersOnly: true,
  data: new SlashCommandBuilder()
    .setName("clean")
    .setDescription("Delete Message")
    .addNumberOption((number) => {
      return number
        .setName("amount")
        .setDescription("Số Lượng Tin Nhắn Cần Xoá")
        .setRequired(true);
    })
    .addChannelOption((channel) => {
      return channel
        .setName("channel")
        .setDescription("Channel Cần Xoá Tin Nhắn")
        .setRequired(true);
    }),
  /**
   * @param {CommandInteraction} interaction
   * @param {Client} client
   */
  async execute(interaction, client) {
    const amount = interaction.options.get("amount").value;
    const channelId = interaction.options.get("channel").value;
    const messages = await interaction.guild.channels.cache
      .get(channelId)
      .messages.fetch({ limit: Number(amount) });
    messages.forEach((m) => m.delete());
    return interaction.reply({
      content: `Đã Xoá ${amount > 1 ? `${amount}'s` : amount} Message.`,
      ephemeral: true,
    });
  },
};
