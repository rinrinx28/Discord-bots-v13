const {
  CommandInteraction,
  MessageEmbed,
  Client,
  MessageActionRow,
  MessageSelectMenu,
} = require("discord.js");
const { SlashCommandBuilder } = require("@discordjs/builders");
const messdb = require("../../schema/reactMess");
const roledata = require("../../schema/roledata");
module.exports = {
  permission: "ADMINISTRATOR",
  developersOnly: false,
  data: new SlashCommandBuilder()
    .setName("removerole")
    .setDescription("Xoá Role ra khỏi React")
    .addRoleOption((option) => {
      return option
        .setName("roles")
        .setDescription("Chọn Role để xoá")
        .setRequired(true);
    })
    .addStringOption((option) => {
      return option
        .setName("idreact")
        .setDescription("ID React")
        .setRequired(true);
    }),
  /**
   * @param {CommandInteraction} interaction
   * @param {Client} client
   */
  async execute(interaction, client) {
    let role_id = interaction.options.getRole("roles").id;
    let role_name = interaction.options.getRole("roles").name;
    let string = interaction.options.getString("idreact");
    let roledb = await roledata.findOne({
      reactId: string,
      role: role_id,
      guilid: interaction.guildId,
    });
    let mess_db = await messdb.find({
      reactId: string,
      guildId: interaction.guildId,
    });
    if (roledb === null)
      return await interaction.reply({
        content: `Hiện không có Role: **${role_name}** trong hệ thống !`,
      });
    var emojiani = roledb.emojiani;
    await roledata.findOneAndDelete({ reactId: string, role: role_id });
    if (mess_db.length < 1)
      return await interaction.reply({
        content: `Bạn đã xoá Role: **${role_name}** thành công !`,
        ephemeral: true,
      });
    // Update khi xoá một role trong React
    var role_db = await roledata.find({ reactId: string });
    var descripts = "";
    for (const x in role_db) {
      var role = `<@&${role_db[x].role}>`;
      descripts += `${role} : ${
        role_db[x].emojiani ? role_db[x].emojiani : ""
      } ${role_db[x].descripstion}\n`;
    }
    var embed = new MessageEmbed()
      .setAuthor({
        name: interaction.guild.name,
        iconURL: interaction.guild.iconURL({ dynamic: true }),
      })
      .setColor("GREEN")
      .setDescription("React Role\n" + descripts)
      .setFooter({ text: `Create By ${client.user.username}` })
      .setImage(
        "https://cdn.discordapp.com/attachments/1044653717225484299/1087889607829487710/standard_2.gif",
      )
      .setTimestamp();
    var emoji = emojiani.split(/:/).filter((v) => v.length > 2);
    var idemoji = emoji[1].split(/>/).filter((v) => v.length > 2)[0];
    interaction.guild.channels.cache
      .get(mess_db[0].channelID)
      .messages.fetch(mess_db[0].messageID)
      .then((msg) => {
        msg.edit({ embeds: [embed] });
        msg.reactions.cache.get(idemoji).remove();
      });
    await interaction.reply({
      content: `Bạn đã xoá Role: **${role_name}** thành công !`,
      ephemeral: true,
    });
  },
};
