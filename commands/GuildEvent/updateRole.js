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
    // Create scripts about insert new User have Role into Database
    const type = interaction.options.getRole("type");
    const timerate = interaction.options.getString("timerate");
    const guildId = interaction.guildId;
    const guild = client.guilds.cache.get(guildId);
    const role = guild.roles.cache.get(type.id);
    // Fetch user have role
    const members = role.members;
    // Create new array to store data
    let data = [];
    // Loop to get data
    members.forEach((member) => {
      data.push({
        idDiscord: member.user.id,
        idRole: type.id,
        status: false,
        timeOnline: 0,
      });
    });
    // Check User have role in database if this user not have role in database then delete this user without database
    const dataRole = await rOnline.find({ idRole: type.id });
    // Loop to check
    dataRole.forEach(async (role) => {
      const user = guild.members.cache.get(role.idDiscord);
      if (!user) {
        await rOnline.deleteOne({ idDiscord: role.idDiscord });
      }
    });
    // Insert data into database without duplicate
    data.forEach(async (user) => {
      const check = await rOnline.findOne({
        idDiscord: user.idDiscord,
      });
      if (!check) {
        await rOnline.create(user);
      } else {
        await rOnline.findOneAndUpdate(
          { idDiscord: user.idDiscord },
          { idRole: user.idRole },
        );
      }
    });
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
