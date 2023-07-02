const {
  CommandInteraction,
  version: discordjsVersion,
  MessageEmbed,
  Client,
} = require("discord.js");
const { SlashCommandBuilder } = require("@discordjs/builders");
module.exports = {
  permission: "ADMINISTRATOR",
  developersOnly: true,
  data: new SlashCommandBuilder()
    .setName("information")
    .setDescription("Info of Bot App!"),
  /**
   * @param {CommandInteraction} interaction
   * @param {Client} client
   */
  async execute(interaction, client) {
    await interaction.reply({
      embeds: [
        new MessageEmbed()
          .setTitle("📑 | Information Of Bot App")
          .setColor("GREY")
          .setDescription(
            `**Bot Name :** ${client.user.username}\n**Total Server:** ${
              client.guilds.cache.size
            } ${
              client.guilds.cache.size > 1 ? "Servers." : "Server."
            }\n**Total Member:** ${client.guilds.cache.reduce(
              (a, b) => a + b.memberCount,
              0,
            )} ${
              client.guilds.cache.reduce((a, b) => a + b.memberCount, 0) > 1
                ? "Users."
                : "User."
            }\n` +
              `**Discord.js Version:** ${discordjsVersion}\n**Running on Node** ${process.version} on ${process.platform} ${process.arch}\n` +
              `**Memory:** ${(process.memoryUsage().rss / 1024 / 1024).toFixed(
                2,
              )} MB RSS\n${(
                process.memoryUsage().heapUsed /
                1024 /
                1024
              ).toFixed(2)} MB`,
          )
          .setThumbnail(client.user.displayAvatarURL({ dynamic: true })),
      ],
    });
  },
};
