const { Client, CommandInteraction, MessageEmbed } = require("discord.js");

module.exports = {
  name: "interactionCreate",
  /**
   * @param {CommandInteraction} interaction
   * @param {Client} client
   */
  async execute(interaction, client, ws) {
    if (interaction.isCommand()) {
      const command = client.commands.get(interaction.commandName);
      if (!command)
        return (
          interaction.reply({
            embeds: [
              new MessageEmbed()
                .setColor("RED")
                .setDescription("⛔ Đã sảy ra lỗi khi dùng lệnh này"),
            ],
          }) && client.commands.delete(interaction.commandName)
        );
      if (!interaction.member.permissions.has(command.permission)) {
        return interaction.reply({
          embeds: [
            new MessageEmbed()
              .setColor("RED")
              .setDescription("⛔ Bạn không đủ quyền sử dụng lệnh này"),
          ],
        });
      } else if (command.developersOnly) {
        if (!client.config.developer_id.includes(interaction.user.id)) {
          return interaction.reply({
            embeds: [
              new MessageEmbed()
                .setTitle("⛔ | Chỉ có Developers có thể sử dụng lệnh này")
                .setColor("RED")
                .setDescription(
                  `Developers: ${client.config.developer_id
                    .map((v) => `<@${v}>`)
                    .join(" ")} `,
                ),
            ],
          });
        }
      }
      command.execute(interaction, client, ws);
    }
  },
};
