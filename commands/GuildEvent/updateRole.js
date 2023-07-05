const { CommandInteraction, Client, MessageEmbed } = require("discord.js");
const { SlashCommandBuilder } = require("@discordjs/builders");
const rOnline = require("../../schema/role_online");
const time_mean = require("../../schema/time_mean");
module.exports = {
  permission: "MANAGE_ROLES",
  developersOnly: false,
  data: new SlashCommandBuilder()
    .setName("updaterole")
    .setDescription("Cập nhật role online")
    .addRoleOption((option) => {
      return option
        .setName("type")
        .setDescription("Loại role")
        .setRequired(true);
    })
    .addStringOption((option) => {
      return option
        .setName("timerate")
        .setDescription("Thời gian trung bình")
        .setRequired(true);
    }),
  /**
   * @param {CommandInteraction} interaction
   * @param {Client} client
   */
  async execute(interaction, client) {
    const type = interaction.options.getRole("type");
    const timerate = interaction.options.getString("timerate");
    await time_mean.findOneAndUpdate(
      { idRole: type.id },
      { timerate: timerate },
      { upsert: true },
    );
    // Create embed to send
    const embed = new MessageEmbed()
      .setTitle("Cập nhật role online")
      .setDescription(`Đã cập nhật role ${role.name} vào database`)
      .setColor("BLUE")
      .setTimestamp();
    // Send embed
    await interaction.reply({ embeds: [embed] });
  },
};
