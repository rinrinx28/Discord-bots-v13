const {
  CommandInteraction,
  Message,
  MessageEmbed,
  MessageActionRow,
  MessageButton,
  Client,
} = require("discord.js");
const { SlashCommandBuilder } = require("@discordjs/builders");
const logsTicket = require("../../schema/ticketdb");
module.exports = {
  data: new SlashCommandBuilder()
    .setName("cticket")
    .setDescription("ticket open")
    .addChannelOption((option) => {
      return option
        .setName("channel")
        .setDescription("Log Ticket")
        .setRequired(true);
    }),
  description: "tao ticket",
  permission: "ADMINISTRATOR",
  developersOnly: true,
  /**
   * @param {CommandInteraction} interaction
   * @param {Client} client
   */
  async execute(interaction, client) {
    const channel = interaction.options.getChannel("channel").id;
    var embed = new MessageEmbed()
      .setAuthor({
        name: `🔱 V I C T O R Y 🔱 - Ticket Support 🎫`,
        iconURL: client.user.displayAvatarURL({ dynamic: true }),
      })
      .setDescription(
        "Chào mừng bạn đã đến với **🔱 V I C T O R Y ! 🔱**\n \n " +
          " *Xin vui lòng chọn option mà bạn muốn :* \n\n" +
          "> **<a:spinheartyellow:1062193117169713344> Tham gia nhóm** : Nếu bạn muốn làm thành viên của nhóm \n " +
          "> \n" +
          "> **<a:agentwarning327:1062194397351002152> Report** : Nếu bạn cần nói chuyện với quản lí nhóm \n",
      )
      .setColor("#FFFF00")
      .setThumbnail(
        "https://media.discordapp.net/attachments/1039636369649184799/1062180312903323789/VictoryTeam.png?width=586&height=586",
      )

      .setFooter({
        text: `${client.user.username}`,
        iconURL: client.user.displayAvatarURL({ dynamic: true }),
      })
      .setTimestamp();

    var buttom = new MessageActionRow().addComponents(
      new MessageButton()
        .setCustomId("cticket")
        .setLabel("Tham Gia Nhóm")
        .setEmoji("<a:spinheartyellow:1062193117169713344>")
        .setStyle("SUCCESS"),
      new MessageButton()
        .setCustomId("creport")
        .setLabel("Report")
        .setEmoji("<a:agentwarning327:1062194397351002152>")
        .setStyle("DANGER"),
      new MessageButton()
        .setLabel("Support")
        .setStyle("LINK")
        .setURL("https://discordjs.guide"),
    );

    await logsTicket.findOneAndUpdate(
      {
        guildId: interaction.guildId,
      },
      {
        $set: {
          guildId: interaction.guildId,
          chLog: channel,
        },
      },
      {
        upsert: true,
        new: true,
      },
    );
    interaction.reply({
      content: "ticket đã được tạo thành công",
      ephemeral: true,
    });
    interaction.channel.send({ embeds: [embed], components: [buttom] });
  },
};
