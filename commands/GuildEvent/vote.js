const {
  MessageEmbed,
  MessageButton,
  MessageActionRow,
  CommandInteraction,
  Message,
} = require("discord.js");
const { SlashCommandBuilder } = require("@discordjs/builders");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("vote")
    .setDescription("Tạo phiếu bầu")
    .addStringOption((option) =>
      option
        .setName("noidung")
        .setDescription("Nội dung phiếu bầu")
        .setRequired(true),
    )
    .addStringOption((option) =>
      option.setName("user").setDescription("ung cu vien"),
    ),
  /**
   *
   * @param {CommandInteraction} interaction
   */
  async execute(interaction) {
    const noidung = interaction.options.getString("noidung");
    const user = interaction.options.get("user");
    const button = new MessageButton()
      .setCustomId("vote_button")
      .setStyle("PRIMARY")
      .setEmoji("👍");
    let users = user.value.split(" ");
    if (users.length > 0) {
      for (const x in users) {
        const data = users[x];
        let embed = new MessageEmbed()
          .setTitle("THAM KHẢO Ý KIẾN")
          .setDescription(`**- ${noidung}**\n**${data} đã vote: 0**`)
          .setColor("BLUE")
          .setTimestamp();
        const row = new MessageActionRow().addComponents(button);
        await interaction.channel.send({
          embeds: [embed],
          components: [row],
          fetchReply: true,
        });
      }
    } else {
      let embed = new MessageEmbed()
        .setTitle("THAM KHẢO Ý KIẾN")
        .setDescription(`**- ${noidung}**\n**CA đã vote: 0**`)
        .setColor("BLUE")
        .setTimestamp();
      const row = new MessageActionRow().addComponents(button);
      await interaction.channel.send({
        embeds: [embed],
        components: [row],
        fetchReply: true,
      });
    }

    // const logChannelId = "1117205431266332742"; // ID của channel log
    // interaction.reply({
    //   content: `Bạn đã tạo vote thành công`,
    //   ephemeral: true,
    // });
  },
};
