const {
  CommandInteraction,
  MessageEmbed,
  Client,
  MessageActionRow,
  MessageSelectMenu,
} = require("discord.js");
const { SlashCommandBuilder } = require("@discordjs/builders");
const messlogs = require("../../schema/messlog");
const roledb = require("../../schema/roledata");
const messdb = require("../../schema/reactMess");
module.exports = {
  permission: "ADMINISTRATOR",
  developersOnly: false,
  data: new SlashCommandBuilder()
    .setName("reactamake")
    .setDescription("Thêm Role vào React")
    .addChannelOption((option) => {
      return option
        .setName("channels")
        .setDescription("Chọn Role thêm vào React")
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
  async execute(interaction, client, ws) {
    let channel_id = interaction.options.getChannel("channels").id;
    let string = interaction.options.getString("idreact");
    let mess_db = await messdb.find({
      reactId: string,
      guildId: interaction.guildId,
    });
    if (mess_db.length > 0) {
      return await interaction.reply({
        content: `Bạn đã tạo một React với ID, React: [Message](https://discord.com/channels/${interaction.guildId}/${mess_db[0].channelID}/${mess_db[0].messageID})`,
      });
    }
    const role_db = await roledb.find({
      reactId: string,
      guildId: interaction.guildId,
    });
    if (role_db.length < 1)
      return await interaction.reply({
        content:
          "Hiện không có Role nào trong hệ thống, xin vui lòng thêm vào. Sử dụng lệnh `/addrole`",
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
    await interaction.reply({
      content: "Bạn đã tạo thành công !",
      ephemeral: true,
    });
    var mess = await interaction.guild.channels.cache.get(channel_id).send({
      embeds: [embed],
    });
    for (const x in role_db) {
      var emojiani = role_db[x].emojiani;
      await mess.react(emojiani);
    }
    await messdb.findOneAndUpdate(
      {
        messageID: mess.id,
        channelID: channel_id,
        guildId: interaction.guildId,
      },
      {
        $set: {
          reactId: string,
          messageID: mess.id,
          channelID: channel_id,
          guildId: interaction.guildId,
        },
      },
      {
        upsert: true,
        new: true,
      },
    );
  },
};
