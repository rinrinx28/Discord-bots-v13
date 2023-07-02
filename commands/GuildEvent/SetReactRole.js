const {
  CommandInteraction,
  MessageEmbed,
  Client,
  MessageActionRow,
  MessageSelectMenu,
} = require("discord.js");
const { SlashCommandBuilder } = require("@discordjs/builders");
const roledb = require("../../schema/roledata");
const messdb = require("../../schema/reactMess");
module.exports = {
  permission: "ADMINISTRATOR",
  developersOnly: false,
  data: new SlashCommandBuilder()
    .setName("addrole")
    .setDescription("Thêm Role vào React")
    .addRoleOption((option) => {
      return option
        .setName("roles")
        .setDescription("Chọn Role thêm vào React")
        .setRequired(true);
    })
    .addStringOption((option) => {
      return option
        .setName("idreact")
        .setDescription("ID React")
        .setRequired(true);
    })
    .addStringOption((option) => {
      return option
        .setName("descripstion")
        .setDescription("Thông tin role")
        .setRequired(true);
    })
    .addStringOption((option) => {
      return option
        .setName("emojiani")
        .setDescription("Emoji animation")
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
    let emojiani = interaction.options.getString("emojiani");
    let descripstion = interaction.options.getString("descripstion");
    await roledb.findOneAndUpdate(
      {
        role: role_id,
        reactId: string,
        guildId: interaction.guildId,
      },
      {
        $set: {
          reactId: string,
          guildId: interaction.guildId,
          name: role_name,
          role: role_id,
          descripstion: descripstion,
          emojiani: emojiani,
        },
      },
      {
        upsert: true,
        new: true,
      },
    );
    const mess_db = await messdb.findOne({
      reactId: string,
      guildId: interaction.guildId,
    });
    // Update khi thêm một role mới vào trong React
    const role_db = await roledb.find({
      reactId: string,
      guildId: interaction.guildId,
    });
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
      .setDescription(descripts)
      .setFooter({ text: `Create By ${client.user.username}` })
      .setImage(
        "https://cdn.discordapp.com/attachments/1044653717225484299/1087889607829487710/standard_2.gif",
      )
      .setTimestamp();
    interaction.guild.channels.cache
      .get(mess_db.channelID)
      .messages.fetch(mess_db.messageID)
      .then((msg) => {
        msg.edit({ embeds: [embed] });
        msg.react(emojiani);
      });
    await interaction.reply({
      content: `Bạn đã thêm Role: **${role_name}** thành công !`,
      ephemeral: true,
    });
  },
};
