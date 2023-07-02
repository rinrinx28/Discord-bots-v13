process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
const fetch = require("node-fetch");
const {
  Client,
  MessageButton,
  MessageEmbed,
  MessageActionRow,
} = require("discord.js");
let url = "https://51.79.229.155:43221/players.json";
const timeonline = require("../schema/presoncheck");
const { hexToDec, decToHex } = require("number-convert");
const moment = require("moment");
const config = require("../config/main.json");
var cron = require("node-cron");

/**
 * @param {Client} client
 */

module.exports = async (client) => {
  const guildId = config.guild1;
  const prefix = "?";
  cron.schedule(
    "0 0 * * Mon",
    async () => {
      const data = await timeonline.find({ guilid: guildId });
      data.forEach(async (v) => {
        await timeonline.findOneAndUpdate(
          { guilid: guildId, steamid: v.steamid },
          { $set: { timejoin: 0, timeleave: 0, timeonline: 0 } },
          { new: true, upsert: true },
        );
      });
      client.guilds.cache
        .get(guildId)
        .channels.cache.get(config.tclist)
        .send("Da update!");
    },
    { scheduled: true, timezone: "Asia/Ho_Chi_Minh" },
  );
  /**
   * @dev Tinh tổng thời gian Online
   * @n second
   */
  function timeConvert(n) {
    var d = n;
    var h = Math.floor(d / 60 / 60);
    var m = Math.floor((d - h * 60 * 60) / 60);
    var s = d - (h * 60 * 60 + m * 60);
    // 15336 => Second
    // Hours: 15336 / 60 / 60 => 4
    // Minutes: (15336 - (hours * 60 * 60)) / 60  => 15
    // Second: 15336 - ((minutes * 60) + (hours * 60 * 60)) => 36

    return { h: h, m: m, s: s };
  }
  client.on("ready", async () => {
    //* ———————————————[Function]———————————————
    /**
     *
     * @param {Array} db
     */
    async function findtarget(db) {
      const repsone = await fetch(url);
      const data_sv = await repsone.text();
      var data_first = JSON.parse(data_sv)
        .map((v) => {
          var steam = v.identifiers.filter((v) => v.startsWith("steam"));
          var discord = v.identifiers.filter((v) => v.startsWith("discord"));
          return {
            steamid: steam[0],
            name: v.name,
            id: v.id,
            ping: v.ping,
            discordid: discord[0].split(":")[1],
          };
        })
        .flat();
      for (const x in db) {
        var check = data_first.filter((v) => v.steamid === db[x].steamid);
        if (check.length > 0) {
          await queryUserInDb(db[x].steamid, check);
        } else {
          await queryUserOutDb(db[x].steamid);
        }
      }
      return data_first;
    }
    /**
     *
     * @param {string} steamid
     * @param {Array} info
     */
    async function queryUserInDb(steamid, info) {
      const data = await timeonline.findOne({
        steamid: steamid,
        guilid: guildId,
      });
      if (data.timejoin === 0) {
        var now = Math.floor(new Date().getTime() / 1000.0);
        await timeonline.findOneAndUpdate(
          { steamid: steamid, guilid: guildId },
          {
            $set: {
              name: info[0].name,
              timejoin: now,
              timeleave: 0,
              id: info[0].id,
              discordid: info[0].discordid,
            },
          },
          { new: true, upsert: true },
        );
        sendMessage([info, now], "in");
      }
    }
    /**
     *
     * @param {String} steamid
     */
    async function queryUserOutDb(steamid) {
      const data = await timeonline.findOne({
        guilid: guildId,
        steamid: steamid,
      });
      if (data.timejoin !== 0) {
        var now = Math.floor(new Date().getTime() / 1000.0);
        await timeonline.findOneAndUpdate(
          { steamid: steamid, guilid: guildId },
          {
            $set: {
              timejoin: 0,
              timeleave: now,
              timeonline: now - data.timejoin + data.timeonline,
            },
          },
          { new: true, upsert: true },
        );
        sendMessage([data, now], "out");
      }
    }

    /**
     *
     * @param {Array} user
     * @param {string} type
     * @returns message
     */
    async function sendMessage(user, type) {
      let guild_id = "1034209710930415729";
      let channel_id = "1110243745078714439";
      let guild = client.guilds.cache.get(guild_id);
      let channel = guild.channels.cache.get(channel_id);
      if (type === "in") {
        var embed = new MessageEmbed()
          .setAuthor({
            name: `${guild.name} - In Server`,
            iconURL: guild.iconURL({ dynamic: true }),
          })
          .setColor("GREEN")
          .addFields(
            { name: "ID Steam", value: user[0][0].steamid, inline: true },
            {
              name: "Name Ingame",
              value: `${user[0][0].name}`,
              inline: true,
            },
            {
              name: "ID Ingame",
              value: `${user[0][0].id}`,
              inline: true,
            },
            {
              name: "ID Discord",
              value: `<@${user[0][0].discordid}>`,
              inline: false,
            },
            {
              name: "JoinTime",
              value: `<t:${user[1]}:F>`,
              inline: false,
            },
          )
          .setThumbnail(guild.iconURL({ dynamic: true }));
        channel.send({ embeds: [embed] });
      } else {
        const { h, m, s } = timeConvert(Math.floor(user[1] - user[0].timejoin));
        var embed = new MessageEmbed()
          .setAuthor({
            name: `${guild.name} - Out Server`,
            iconURL: guild.iconURL({ dynamic: true }),
          })
          .setColor("RED")
          .addFields(
            { name: "ID Steam", value: `${user[0].steamid}`, inline: true },
            { name: "Name Ingame", value: `${user[0].name}`, inline: true },
            {
              name: "ID Ingame",
              value: `${user[0].id}`,
              inline: true,
            },
            {
              name: "ID Discord",
              value: `<@${user[0].discordid}>`,
              inline: false,
            },
            {
              name: "LeaveTime",
              value: `<t:${user[1]}:F>`,
              inline: false,
            },
            {
              name: "SumTime",
              value: `Giờ: ${h} - Phút: ${m} - Giây: ${s}`,
              inline: false,
            },
          )
          .setThumbnail(guild.iconURL({ dynamic: true }));
        channel.send({ embeds: [embed] });
      }
    }

    async function start() {
      const data_time = await timeonline.find({ guilid: guildId });
      if (data_time.length > 0) {
        findtarget(data_time);
      }
    }
    //* ——————————————————————————————————————————

    //* ———————————————[Timeout]———————————————
    setInterval(() => start(), 1e3 * 2.5);
    //* ——————————————————————————————————————————
  });
  client.on("messageCreate", async (msg) => {
    const content = msg.content.toLocaleLowerCase();
    if (content.startsWith(prefix + "timeonl")) {
      var page = [];
      var embed = [];
      var fields = [];
      const data = await timeonline.find({ guilid: msg.guildId });
      if (data.length < 1) return msg.reply("Data trong!");
      data.forEach((v) => {
        const discordid = v.discordid;
        var { h, m, s } = timeConvert(v.timeonline);
        fields.push({
          name: `${v.name}`,
          value: `Trang Thai ${
            v.timejoin !== 0 ? "🟢" : "🔴"
          } \n${h} gio ${m} phut\n<@${discordid}>`,
          inline: true,
        });
        if (fields.length > 24) {
          page.push(fields);
          fields = [];
        }
      });
      page.push(fields);
      page.forEach((v) => {
        embed.push(
          new MessageEmbed()
            .addFields(v)
            .setColor("GREEN")
            .setTitle("Danh sach online"),
        );
      });
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
      var button = [previousbtn, nextbtn];
      let pages = 0;
      const row = new MessageActionRow().addComponents(button);
      const curPage = await msg.reply({
        embeds: [
          embed[pages].setFooter({
            text: `Page ${pages + 1} / ${embed.length}`,
          }),
        ],
        components: [row],
      });

      const filter = (i) =>
        i.customId === button[0].customId || i.customId === button[1].customId;

      const collector = await curPage.createMessageComponentCollector({
        filter,
        time: 1e3 * 60 * 2,
      });

      collector.on("collect", async (i) => {
        switch (i.customId) {
          case button[0].customId:
            pages = pages > 0 ? --pages : embed.length - 1;
            break;
          case button[1].customId:
            pages = pages + 1 < embed.length ? ++pages : 0;
            break;
          default:
            break;
        }
        await i.deferUpdate();
        await i.editReply({
          embeds: [
            embed[pages].setFooter({
              text: `Page ${pages + 1} / ${embed.length}`,
            }),
          ],
          components: [row],
        });
        collector.resetTimer();
      });

      collector.on("end", (_, reason) => {
        if (reason !== "messageDelete") {
          const disabledRow = new MessageActionRow().addComponents(
            button[0].setDisabled(true),
            button[1].setDisabled(true),
          );
          curPage.edit({
            embeds: [
              embed[pages].setFooter({
                text: `Page ${pages + 1} / ${embed.length}`,
              }),
            ],
            components: [disabledRow],
          });
        }
      });
    }
  });
};
