const {
  CommandInteraction,
  Client,
  MessageButton,
  MessageEmbed,
} = require("discord.js");
const { SlashCommandBuilder } = require("@discordjs/builders");
const presoncheck = require("../../schema/presoncheck");
const paginationEmbed = require("discordjs-button-pagination");
const { hexToDec } = require("number-convert");
module.exports = {
  permission: "ADMINISTRATOR",
  developersOnly: false,
  data: new SlashCommandBuilder()
    .setName("alluser")
    .setDescription("Xem Tất Cả Các User Trong Guild"),
  /**
   * @param {CommandInteraction} interaction
   * @param {Client} client
   */
  async execute(interaction, client, ws) {
    let queryQTV = await presoncheck.findOne({
      discordid: interaction.member.id,
    });
    /**
     * Level = 1 : QTV
     * Level = 0 : Member
     */
    // if (queryQTV !== null) {
    //   if (queryQTV.level === 1) {
    //     if (queryQTV.guilid === guilid) {
    let data = await presoncheck.find();
    var listpage = [];
    var count = 0;
    var page = 0;
    var list = [];
    for (const x in data) {
      if (data[x].name !== undefined) {
        var data_name = data[x].name.split("|");
        data_name.length > 2 ? data_name.splice(0, 1) : null;
        list.push({
          steamid: `${data[x].steamid}`,
          nameig: `${data_name.join(" | ")}`,
          level: `${data[x].discordid}`,
        });
      } else {
        list.push({
          steamid: `${data[x].steamid}`,
          nameig: `${data[x].name}`,
          level: `${data[x].discordid}`,
        });
      }
      count += 1;
      if (count > 15) {
        listpage[page++] = list;
        list = [];
        count = 0;
      }
    }
    if (list.length > 0) {
      listpage[page++] = list;
    }
    var embed = [];
    var button = [];
    var steamid = "";
    var nameig = "";
    var role = "";
    for (let i = 0; i < page; i++) {
      listpage[i].map((v) => {
        var linksteam = hexToDec(v.steamid.split(":")[1]);
        steamid += `[Steam](https://steamcommunity.com/profiles/${linksteam})\n`;
        nameig += `${v.nameig}\n`;
        role += `<@${v.level}>\n`;
      });
      embed.push(
        new MessageEmbed()
          .setAuthor({
            name: `${interaction.guild.name} - Tổng Thành Viên`,
            iconURL: interaction.guild.iconURL({ dynamic: true }),
          })
          .setTitle(`Danh Sách Thành Viên : ${data.length}`)
          .setColor("GREEN")
          .addFields(
            { name: "Tên In Game", value: nameig, inline: true },
            { name: "Thông Tin", value: role, inline: true },
            { name: "Steam", value: steamid, inline: true },
          ),
      );
      steamid = "";
      nameig = "";
      role = "";
    }
    const previousbtn = new MessageButton()
      .setCustomId("previousbtn")
      .setLabel("Previous")
      .setEmoji("👈")
      .setStyle("PRIMARY");

    const nextbtn = new MessageButton()
      .setCustomId("nextbtn")
      .setLabel("Next")
      .setEmoji("👉")
      .setStyle("SUCCESS");
    button = [previousbtn, nextbtn];
    paginationEmbed(interaction, embed, button, 120000);
  },
};
