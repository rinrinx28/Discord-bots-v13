const { CommandInteraction, Client, MessageEmbed } = require("discord.js");
const { SlashCommandBuilder } = require("@discordjs/builders");
const groups = require("../../schema/datagroups");
const logsguild = require("../../schema/logsguild");
module.exports = {
  permission: "ADMINISTRATOR",
  developersOnly: false,
  data: new SlashCommandBuilder()
    .setName("add")
    .setDescription("Thêm Gang/Nhóm Vào Hệ thống")
    .addStringOption((option) => {
      return option
        .setName("type")
        .setDescription("Gang/Nhóm")
        .setRequired(true)
        .addChoices(
          { name: "Nhóm", value: "nhom" },
          { name: "Gang", value: "gang" },
        );
    })
    .addStringOption((option) => {
      return option
        .setName("name")
        .setDescription("Tên Gang/Nhóm")
        .setRequired(true);
    })
    .addStringOption((option) => {
      return option
        .setName("lenh")
        .setDescription("Tên lệnh nhập nhanh.")
        .setRequired(true);
    })
    .addStringOption((option) => {
      return option
        .setName("haucan")
        .setDescription("Tên hậu cần Gang. Nếu nhóm thì không cần.");
    }),
  /**
   * @param {CommandInteraction} interaction
   * @param {Client} client
   */
  async execute(interaction, client) {
    let type = interaction.options.getString("type");
    let name = interaction.options.getString("name");
    let haucan = interaction.options.getString("haucan");
    let cmds = interaction.options.getString("lenh");
    const logs = await logsguild.findOne({
      guilid: interaction.guildId,
      logstype: "groups",
    });
    switch (type) {
      case "gang":
        if (haucan === null)
          return interaction.reply({
            content:
              "Bạn đã nhập thiếu tên hậu cần của gang. Xin vui lòng thử lại.",
          });
        await groups.findOneAndUpdate(
          {
            guilid: interaction.guildId,
            type: type,
            name: name,
          },
          {
            $set: {
              guilid: interaction.guildId,
              type: type,
              name: name,
              haucan: haucan,
              cmds: cmds.split(","),
            },
          },
          {
            upsert: true,
            new: true,
          },
        );
        interaction.reply({
          content:
            "Bạn đã thêm thành công`" +
            type.toUpperCase() +
            ": " +
            name +
            " `vào hệ thống!",
        });
        if (logs !== null) {
          var embed = new MessageEmbed()
            .setAuthor({
              name: interaction.guild.name + " - Add" + type,
              iconURL: interaction.guild.iconURL({ dynamic: true }),
            })
            .setColor("GREEN")
            .setDescription(
              `${interaction.member.user.username} đã thêm ${type}: ${name} vào hệ thống.`,
            )
            .setThumbnail(
              interaction.member.displayAvatarURL({ dynamic: true }),
            )
            .setImage(
              interaction.member.user.banner
                ? interaction.member.user.bannerURL()
                : null,
            )
            .setFooter({
              text: `Create by ${client.user.username}`,
              iconURL: client.user.displayAvatarURL({ dynamic: true }),
            });
          interaction.guild.channels.cache
            .get(logs.channellogs)
            .send({ embeds: [embed] });
        }
        break;
      case "nhom":
        await groups.findOneAndUpdate(
          {
            guilid: interaction.guildId,
            type: type,
            name: name,
          },
          {
            $set: {
              guilid: interaction.guildId,
              type: type,
              name: name,
              cmds: cmds.split(","),
            },
          },
          {
            upsert: true,
            new: true,
          },
        );
        interaction.reply({
          content:
            "Bạn đã thêm thành công`" +
            type +
            ": " +
            name +
            " ` vào thệ thống!",
        });
        if (logs !== null) {
          var embed = new MessageEmbed()
            .setAuthor({
              name: interaction.guild.name + " - Add" + type,
              iconURL: interaction.guild.iconURL({ dynamic: true }),
            })
            .setColor("GREEN")
            .setDescription(
              `${interaction.member.user.username} đã thêm ${type}: ${name} vào hệ thống.`,
            )
            .setThumbnail(
              interaction.member.displayAvatarURL({ dynamic: true }),
            )
            .setImage(
              interaction.member.user.banner
                ? interaction.member.user.bannerURL()
                : null,
            )
            .setFooter({
              text: `Create by ${client.user.username}`,
              iconURL: client.user.displayAvatarURL({ dynamic: true }),
            });
          interaction.guild.channels.cache
            .get(logs.channellogs)
            .send({ embeds: [embed] });
        }
        break;
      default:
        return interaction.reply({ content: "Đã sảy ra lỗi !" });
    }
  },
};
