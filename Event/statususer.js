const {
  Client,
  CommandInteraction,
  MessageEmbed,
  MessageButton,
} = require("discord.js");
const presoncheck = require("../schema/presoncheck");
const paginationEmbed = require("discordjs-button-pagination");
const moment = require("moment/moment");
var hexToDec = require("number-convert");
module.exports = {
  name: "interactionCreate",
  names: "Status User",
  /**
   * @param {CommandInteraction} interaction
   * @param {Client} client
   */
  async execute(interaction, client) {
    if (interaction.isButton()) {
      let btn_id = interaction.customId;
      if (btn_id === "statusbtn") {
        let data = await presoncheck.find({ guilid: interaction.guildId });
        var listpage = [];
        var count = 0;
        var page = 0;
        var list = [];
        for (const x in data) {
          list.push({
            steamid: `${data[x].steamid}`,
            nameig: `${data[x].name}`,
            level: `${
              data[x].timeleave === 0
                ? "🟢 Online"
                : `🔴 Offline (${moment.unix(data[x].timeleave).fromNow()})`
            }`,
          });
          count += 1;
          if (count > 24) {
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
            steamid += `[Steam Profiles](https://steamcommunity.com/profiles/${hexToDec(
              v.steamid,
              16,
              10,
            )})\n`;
            nameig += `${v.nameig}\n`;
            role += `${v.level}\n`;
          });
          embed.push(
            new MessageEmbed()
              .setAuthor({
                name: `${interaction.guild.name} - Trạng Thái Thành Viên`,
                iconURL: interaction.guild.iconURL({ dynamic: true }),
              })
              .setTitle(`Danh Sách Trạng Thái Thành Viên : ${data.length}`)
              .setColor("GREEN")
              .addFields(
                { name: "Steam", value: steamid, inline: true },
                { name: "Tên In Game", value: nameig, inline: true },
                { name: "Trạng Thái", value: role, inline: true },
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
      }
    }
  },
};
