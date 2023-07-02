const {
  CommandInteraction,
  MessageEmbed,
  Client,
  MessageActionRow,
  MessageSelectMenu,
} = require("discord.js");
const { SlashCommandBuilder } = require("@discordjs/builders");
const groups = require("../../schema/datagroups");
module.exports = {
  permission: "ADMINISTRATOR",
  developersOnly: true,
  data: new SlashCommandBuilder()
    .setName("alldata")
    .setDescription("Kiểm tra toàn bộ")
    .addStringOption((option) => {
      return option
        .setName("type")
        .setDescription("Chọn một kiểu Groups mà bạn muốn kiểm tra")
        .setRequired(true)
        .addChoices(
          { name: "Gang", value: "gang" },
          { name: "Nhóm", value: "nhom" },
          { name: "Tổ chức", value: "groups" },
        );
    }),
  /**
   * @param {CommandInteraction} interaction
   * @param {Client} client
   */
  async execute(interaction, client) {
    let type = interaction.options.getString("type");
    let data = await groups.find({
      guilid: interaction.guildId,
      type: type,
    });
    let options = [];
    switch (type) {
      case "gang":
        if (data.length > 0) {
          for (const x in data) {
            options.push({
              label: data[x].name,
              description: data[x].name,
              value: data[x].name,
            });
          }
          let rows = new MessageActionRow().addComponents(
            new MessageSelectMenu()
              .setCustomId("gang")
              .setPlaceholder("Chọn Gang bạn muốn kiểm tra")
              .addOptions(options),
          );
          let embed = new MessageEmbed()
            .setAuthor({
              name: `${interaction.guild.name} - Select Gang`,
              iconURL: interaction.guild.iconURL({ dynamic: true }),
            })
            .setColor("GREEN")
            .setDescription(
              "Vui lòng chọn Gang mà bạn muốn xem ở phía bên dưới. 👇👇👇",
            )
            .setFooter({
              text: "Create by " + client.user.username,
              iconURL: client.user.displayAvatarURL({ dynamic: true }),
            });
          interaction.reply({ embeds: [embed], components: [rows] });
        } else
          interaction.reply({
            content:
              "Hiện tại không có Gang nào trong hệ thống, xin vui lòng thử lại sau !",
          });
        break;
      case "nhom":
        if (data.length > 0) {
          for (const x in data) {
            options.push({
              label: data[x].name,
              value: data[x].name,
            });
          }
          let rows = new MessageActionRow().addComponents(
            new MessageSelectMenu()
              .setCustomId("nhom")
              .setPlaceholder("Chọn Nhóm bạn muốn kiểm tra")
              .addOptions(options),
          );
          let embed = new MessageEmbed()
            .setAuthor({
              name: `${interaction.guild.name} - Select Nhóm`,
              iconURL: interaction.guild.iconURL({ dynamic: true }),
            })
            .setColor("GREEN")
            .setDescription(
              "Vui lòng chọn Nhóm mà bạn muốn xem ở phía bên dưới. 👇👇👇",
            )
            .setFooter({
              text: "Create by " + client.user.username,
              iconURL: client.user.displayAvatarURL({ dynamic: true }),
            });
          interaction.reply({ embeds: [embed], components: [rows] });
        } else
          interaction.reply({
            content:
              "Hiện tại không có Gang nào trong hệ thống, xin vui lòng thử lại sau !",
          });
        break;
      case "groups":
        let rows = new MessageActionRow().addComponents(
          new MessageSelectMenu()
            .setCustomId("groups")
            .setPlaceholder("Chọn Groups bạn muốn kiểm tra")
            .addOptions(
              {
                label: "Công An",
                value: "ca",
              },
              {
                label: "Bác sĩ",
                value: "med",
              },
              {
                label: "Cứu hộ",
                value: "ch",
              },
            ),
        );
        let embed = new MessageEmbed()
          .setAuthor({
            name: `${interaction.guild.name} - Select Groups`,
            iconURL: interaction.guild.iconURL({ dynamic: true }),
          })
          .setColor("GREEN")
          .setDescription(
            "Vui lòng chọn Groups mà bạn muốn xem ở phía bên dưới. 👇👇👇",
          )
          .setFooter({
            text: "Create by " + client.user.username,
            iconURL: client.user.displayAvatarURL({ dynamic: true }),
          });
        interaction.reply({ embeds: [embed], components: [rows] });
        break;
      default:
        return interaction.reply({ content: "Đã sảy ra lỗi !" });
    }
  },
};
