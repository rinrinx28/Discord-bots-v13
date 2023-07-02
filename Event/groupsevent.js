process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
const fetch = require("node-fetch");
const {
  Client,
  Message,
  MessageEmbed,
  MessageActionRow,
  MessageButton,
  Integration,
} = require("discord.js");
const paginationEmbed = require("discordjs-button-pagination");
const { client_token } = require("./../config/main.json");
const groups = require("../schema/datagroups");
const config = require("../config/main.json");
let url = "https://51.79.229.155:43221/players.json";
var hexToDec = require("number-convert");
const fs = require("fs");
let data_all_user_bc = new Map();
let data_all_user = new Map();

//    setTimeout(() => message.delete(), 5000);

module.exports = {
  name: "messageCreate",
  names: "Groups Event",

  /**
   * @param {Message} message
   * @param {Client} client
   */
  async execute(message, client) {
    async function sendbc(embeds, msg) {
      const previousbtn = new MessageButton()
        .setCustomId("previousbtn")
        .setLabel("Trang Trước")
        .setEmoji("👈")
        .setStyle("PRIMARY");

      const nextbtn = new MessageButton()
        .setCustomId("nextbtn")
        .setLabel("Trang Sau")
        .setEmoji("👉")
        .setStyle("SUCCESS");
      buttons = [previousbtn, nextbtn];
      // Chia Page theo Button
      let pages = 0;

      const row = new MessageActionRow().addComponents(buttons);
      const curPage = await msg.edit({
        embeds: [
          embeds[pages].setFooter({
            text: `Trang ${pages + 1} / ${embeds.length}`,
          }),
        ],
        components: [row],
        content: "**Đã đếm xong =))))) <a:popcat:1034064630412230686>**",
      });

      const filter = (i) =>
        i.customId === buttons[0].customId ||
        i.customId === buttons[1].customId;

      const collector = await curPage.createMessageComponentCollector({
        filter,
        time: 1000 * 60 * 5,
      });

      collector.on("collect", async (i) => {
        switch (i.customId) {
          case buttons[0].customId:
            pages = pages > 0 ? --pages : embeds.length - 1;
            break;
          case buttons[1].customId:
            pages = pages + 1 < embeds.length ? ++pages : 0;
            break;
          default:
            break;
        }
        await i.deferUpdate();
        await curPage.edit({
          embeds: [
            embeds[pages].setFooter({
              text: `Trang ${pages + 1} / ${embeds.length}`,
            }),
          ],
          components: [row],
        });
        collector.resetTimer();
      });

      collector.on("end", (_, reason) => {
        if (reason !== "messageDelete") {
          const disabledRow = new MessageActionRow().addComponents(
            buttons[0].setDisabled(true),
            buttons[1].setDisabled(true),
          );
          curPage.edit({
            embeds: [
              embeds[pages].setFooter({
                text: `Page ${pages + 1} / ${embeds.length}`,
              }),
            ],
            components: [disabledRow],
          });
        }
      });
    }
    /**
     *
     * @param {Array} data_time Tong Du Lieu Time Cua User
     * @returns {Array}
     */
    function changeTimeToBc(data_time) {
      let bc = 20; // 1 bc = 20p
      let data_bc = data_time.map((user_time) => {
        var author = user_time.author;
        var { hours, minutes } = user_time.time;
        let tbc = Math.floor((minutes + hours * 60) / bc);
        return { author: author, tbc: tbc };
      });
      return data_bc;
    }
    if (message.content.toLowerCase().startsWith(config.prefix + "time")) {
      var msg = message.content;
      var msg_arg = msg.split(" ");
      if (msg_arg.length < 2)
        return message.reply("Xin vui long nhap ID Channel");
      var channel_target = msg_arg.slice(1).join(" ");
      var channel = message.guild.channels.cache.get(channel_target);
      let user_content = {};
      let data_user_msg = [];
      let lastID;
      let messages = [];
      while (true) {
        const fetchedMessages = await channel.messages.fetch({
          limit: 100,
          ...(lastID && { before: lastID }),
        });
        if (fetchedMessages.size === 0) {
          let data_msg = messages
            .filter((v) => !v.author.bot)
            .map((v) => {
              return { author: v.author.id, content: v.content };
            });
          data_msg.forEach(function (x) {
            user_content[x.author] =
              (user_content[x.author] || 0) + `${x.content},`;
          });
          for (const x in user_content) {
            let data = user_content[x]
              .split(",")
              .filter((v) => v.length > 0)
              .map((v) => v);
            data_user_msg.push({ author: x, contentArray: data });
          }
          let data_user_time = data_user_msg.map(function (v) {
            let content = v.contentArray;
            let author = v.author;
            let h = 0;
            let m = 0;
            for (const x in content) {
              var time_en = content[x].toLowerCase();
              //? Time có chứa H và P
              if (time_en.indexOf("h") > -1 && time_en.indexOf("p") > -1) {
                let time_cvt = time_en.split("h");
                let hours = time_cvt[0];
                let minutes = time_cvt[1].split("p")[0];
                h += Number(hours);
                m += Number(minutes);
              } else {
                //? Time Ko có H or P
                if (time_en.indexOf("h") > -1) {
                  //? Query H
                  let time_cvt = time_en.split("h");
                  let hours = time_cvt[0];
                  let minutes = time_cvt[1];
                  h += Number(hours);
                  m += Number(minutes);
                } else {
                  //? Query P
                  let time_cvt = time_en.split("p");
                  let minutes = time_cvt[0];
                  m += Number(minutes);
                }
              }
              if (m >= 60) {
                h += 1;
                m -= 60;
              }
            }
            return { author: author, time: { hours: h, minutes: m } };
          });
          // Function ChangeTimeToBC
          let data_user_bc = changeTimeToBc(data_user_time).sort(function (
            a,
            b,
          ) {
            return b.tbc - a.tbc;
          });
          let user = "";
          let time = "";
          let tbc = "";
          for (const x in data_user_bc) {
            let author = data_user_bc[x].author;
            let tbc = data_user_bc[x].tbc;
            let { time } = data_user_time.filter((v) => v.author === author)[0];
            user += `<@${author}>\n\n`;
            time += `${time.hours} giờ ${time.minutes} phút\n\n`;
            tbc += `${tbc}\n\n`;
          }
          var embed = new MessageEmbed()
            .setTitle(`Tính tổng điểm danh của Công An đêm`)
            .setAuthor({
              name: message.guild.name,
              iconURL: message.guild.iconURL({ dynamic: true }),
            })
            .setDescription(`**KÊNH ĐIỂM DANH LÀ: <#${channel_target}>**`)
            .setURL(config.link)
            .setColor("BLUE")
            .setThumbnail(message.guild.iconURL({ dynamic: true }))
            .setFooter({ text: config.footer })
            .setTimestamp()
            // .setDescription(string);
            .addFields(
              { name: "Công An", value: user, inline: true },
              { name: "Tổng Giờ", value: time, inline: true },
              { name: "Tổng Bao Cao", value: tbc, inline: true },
              //Tong bao cao
            );
          return message.reply({ embeds: [embed] });
        }
        messages = messages.concat(Array.from(fetchedMessages.values()));
        lastID = fetchedMessages.lastKey();
      }
    } else if (message.content.toLowerCase().startsWith(config.prefix + "bc")) {
      var msg = message.content;
      var msg_arg = msg.split(" ");
      if (msg_arg.length < 2)
        return message.reply("Xin vui long nhap ID Channel");
      var channel_target = msg_arg.slice(1).join(" ");
      let channel = message.guild.channels.cache.get(channel_target);
      const msgg = await message.channel.send({
        content:
          "**Đang đếm báo cáo && time.....<a:frogpoof:1034068069619875890>**",
      });
      let arr_data = [];
      const counts = {};
      let lastID;
      let messages = [];
      while (true) {
        const fetchedMessages = await channel.messages.fetch({
          limit: 100,
          ...(lastID && { before: lastID }),
        });
        if (fetchedMessages.size === 0) {
          for (const x in messages) {
            var mention = messages[x].mentions.users;
            await mention.map((v) => arr_data.push(v.id));
          }
          arr_data.forEach(function (x) {
            counts[x] = (counts[x] || 0) + 1;
          });
          // Chuyen Object thanh Array
          let data_bc = [];
          for (const x in counts) {
            data_bc.push({ user: x, sobc: counts[x] });
            data_all_user_bc.set(x, counts[x]);
          }
          data_bc.sort(function (a, b) {
            return b.sobc - a.sobc;
          });
          let string = "";
          let user = "";
          let bc = "";
          let page = [];
          let pagenumber = 0;
          let countpage = 0;
          let embeds = [];
          for (const x in data_bc) {
            if (countpage > 24) {
              page[pagenumber++] = {
                bc: bc,
                user: user,
              };
              bc = "";
              user = "";
              string = "";
              countpage = 0;
            }
            user += `<@${data_bc[x].user}> \n\n`;
            bc += `${data_bc[x].sobc} \n\n`;
            string += `\n<@${data_bc[x].user}> số báo là : ${data_bc[x].sobc}\n`;
            countpage++;
          }
          page[pagenumber++] = { bc: bc, user: user };
          for (const x in page) {
            const { bc, user } = page[x];
            var embed = new MessageEmbed()
              .setTitle(`Tính tổng báo cáo của Công An`)
              .setAuthor({
                name: message.guild.name,
                iconURL: message.guild.iconURL({ dynamic: true }),
              })
              .setURL(config.link)
              .setColor("BLUE")
              .setThumbnail(message.guild.iconURL({ dynamic: true }))
              .setFooter({ text: config.footer })
              .setDescription(
                `**KÊNH BÁO CÁO LÀ: <#${channel_target}>**\n**Trang: ${
                  Number(x) + 1
                }/${page.length}**`,
              )
              .setTimestamp()
              .addFields(
                { name: "Công An", value: user, inline: true },
                { name: "Tổng báo cáo", value: bc, inline: true },
              );
            embeds.push(embed);
          }
          return sendbc(embeds, msgg);
        }
        messages = messages.concat(Array.from(fetchedMessages.values()));
        lastID = fetchedMessages.lastKey();
      }
    } else if (
      message.content.toLowerCase().startsWith(config.prefix + "all2")
    ) {
      var msg = message.content;
      var msg_arg = msg.split(" ");
      if (msg_arg.length < 2)
        return message.reply("Xin vui long nhap ID Channel");
      var channel_target = msg_arg.slice(1).join(" ");
      var channel = message.guild.channels.cache.get(channel_target);
      const msgg = await message.channel.send({
        content:
          "**Đang đếm báo cáo && time.....<a:frogpoof:1034068069619875890>**",
      });
      let user_content = {};
      let data_user_msg = [];
      let lastID;
      let messages = [];
      while (true) {
        const fetchedMessages = await channel.messages.fetch({
          limit: 100,
          ...(lastID && { before: lastID }),
        });
        if (fetchedMessages.size === 0) {
          let data_msg = messages
            .filter((v) => !v.author.bot)
            .map((v) => {
              return { author: v.author.id, content: v.content };
            });
          data_msg.forEach(function (x) {
            user_content[x.author] =
              (user_content[x.author] || 0) + `${x.content},`;
          });
          for (const x in user_content) {
            let data = user_content[x]
              .split(",")
              .filter((v) => v.length > 0)
              .map((v) => v);
            data_user_msg.push({ author: x, contentArray: data });
          }
          let data_user_time = data_user_msg.map(function (v) {
            let content = v.contentArray;
            let author = v.author;
            let h = 0;
            let m = 0;
            for (const x in content) {
              var time_en = content[x].toLowerCase();
              //? Time có chứa H và P
              if (time_en.indexOf("h") > -1 && time_en.indexOf("p") > -1) {
                let time_cvt = time_en.split("h");
                let hours = time_cvt[0];
                let minutes = time_cvt[1].split("p")[0];
                h += Number(hours);
                m += Number(minutes);
              } else {
                //? Time Ko có H or P
                if (time_en.indexOf("h") > -1) {
                  //? Query H
                  let time_cvt = time_en.split("h");
                  let hours = time_cvt[0];
                  let minutes = time_cvt[1];
                  h += Number(hours);
                  m += Number(minutes);
                } else {
                  //? Query P
                  let time_cvt = time_en.split("p");
                  let minutes = time_cvt[0];
                  m += Number(minutes);
                }
              }
              if (m >= 60) {
                h += 1;
                m -= 60;
              }
            }
            return { author: author, time: { hours: h, minutes: m } };
          });
          let data_all = [];
          // Get user bc.
          for (const x in data_user_time) {
            let allbc = 0;
            let author = data_user_time[x].author;
            let { hours, minutes } = data_user_time[x].time;
            if (data_all_user_bc.has(author)) {
              var sobc = data_all_user_bc.get(author);
              var minutes_user = hours * 60 + minutes;
              allbc = Math.floor(minutes_user / 20 + sobc);
              data_all_user.set(author, allbc);
              data_all_user_bc.delete(author);
            } else {
              var minutes_user = hours * 60 + minutes;
              allbc = Math.floor(minutes_user / 20);
              data_all_user.set(author, allbc);
            }
          }
          // 2 Map: data_all_user_bc ; data_all_user
          if (data_all_user_bc.size > 0) {
            data_all_user_bc.forEach(function (value, key, map) {
              data_all.push({ user: key, Tbc: value });
            });
          }
          if (data_all_user.size > 0) {
            data_all_user.forEach(function (value, key, map) {
              data_all.push({ user: key, Tbc: value });
            });
          }
          //Sort Data
          data_all.sort(function (a, b) {
            return b.Tbc - a.Tbc;
          });
          // Chia Page
          let pagetbc = [];
          let pagenumber = 0;
          let countinpage = 0;
          let users = "";
          let tbc = "";
          for (const x in data_all) {
            const { user, Tbc } = data_all[x];
            if (countinpage > 24) {
              pagetbc[pagenumber++] = { user: users, Tbc: tbc };
              countinpage = 0;
              users = "";
              tbc = "";
            }
            countinpage++;
            users += `<@${user}>\n\n`;
            tbc += `${Tbc}\n\n`;
          }
          pagetbc[pagenumber++] = { user: users, Tbc: tbc };
          // Gop Embeds
          let embeds = [];
          for (const x in pagetbc) {
            const { user, Tbc } = pagetbc[x];
            // console.log(pagetbc[x])
            var embed = new MessageEmbed()
              .setTitle(`Đếm báo cáo && time`)
              .setAuthor({
                name: message.guild.name,
                iconURL: message.guild.iconURL({ dynamic: true }),
              })
              .setURL(config.link)
              .setColor("BLUE")
              .setThumbnail(message.guild.iconURL({ dynamic: true }))
              .setFooter({ text: config.footer })
              .setTimestamp()
              .setDescription(
                `**KÊNH ĐẾM LÀ: <#${channel_target}>**\n**Trang: ${
                  Number(x) + 1
                }/${pagetbc.length}**`,
              )
              .addFields(
                { name: "Công AN", value: user, inline: true },
                { name: "Tổng Báo Cáo", value: Tbc, inline: true },
              );
            embeds.push(embed);
          }
          data_all_user_bc.clear();
          data_all_user.clear();
          return sendbc(embeds, msgg);
        }
        messages = messages.concat(Array.from(fetchedMessages.values()));
        lastID = fetchedMessages.lastKey();
      }
    }
    // 1681926659 = 12h || 1681941995 = 5h
  },
};
