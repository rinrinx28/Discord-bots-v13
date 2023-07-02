process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
const fetch = require("node-fetch");
const { Client, MessageEmbed } = require("discord.js");
let url = "https://51.79.229.155:43221/players.json";
const truyna = require("../schema/truyna");
const { hexToDec, decToHex } = require("number-convert");
const MessageNoti = new Map();
const moment = require("moment");
const config = require("../config/main.json");

/**
 * @param {Client} client
 */

module.exports = async (client) => {
  const guildId = config.guild1;
  const prefix = "?";
  client.on("ready", async () => {
    //* ———————————————[Function]———————————————
    /**
     * @description Tim doi tuong truy na
     * @param {Array} truyna
     * @returns Array
     */
    async function findTarget(truyna) {
      const res = await fetch(url).then((r) => r.text());
      const server = JSON.parse(res);
      const data = server.filter(
        (v) =>
          truyna.filter(
            (r) =>
              r.steamid ===
              v.identifiers.filter((s) => s.startsWith("steam"))[0],
          ).length > 0,
      );
      return data;
    }
    /**
     *
     * @param {Array} data
     * @param {Array} truyna_data
     * @returns Boolean
     */
    async function updateTruyNa(data, truyna_data) {
      try {
        var data_target = [];
        for (const x in data) {
          var e = data[x];
          var name = e.name;
          const steamid = e.identifiers.filter((v) => v.startsWith("steam"))[0];
          const data_old = truyna_data.filter((v) => v.steamid === steamid)[0];
          // Luu truy na
          await truyna.findOneAndUpdate(
            {
              guilid: guildId,
              steamid: steamid,
            },
            {
              $set: {
                name: name,
              },
            },
            {
              upsert: true,
            },
          );
          const datas = {
            name: name,
            name_old: data_old.name,
            steamid: steamid,
            id: e.id,
            reason: data_old.reason,
            time: data_old.time,
          };
          data_target.push(datas);
          datas.name !== datas.name_old &&
            sendNotiChangeName(datas, data_old._id);
        }
        sendNoti(data_target);
        return true;
      } catch (e) {
        console.error(e);
        return false;
      }
    }
    async function sendNotiChangeName(data, _id) {
      await truyna.findByIdAndUpdate(
        { _id: _id },
        { $push: { listname: "`" + data.name_old + "`" } },
      );
      const target = await truyna.findOne({
        steamid: data.steamid,
        guilid: guildId,
      });
      var steamid = data.steamid;
      var linksteam =
        "https://steamcommunity.com/profiles/" +
        hexToDec(steamid.split(":")[1]);
      var embed = new MessageEmbed()
        .setTitle("Phát hiện có người đổi tên")
        .setColor("BLUE")
        .setDescription(
          `Tên cũ: ${
            (target.listname.length === 1 && target.listname[0]) ||
            (target.listname.length > 1 && target.listname.join(", "))
          }\n` +
            "Tên mới: " +
            `${data.name}\n` +
            "Link Steam: " +
            `${linksteam}\n`,
        );
      // Auto Spam
      const channel = client.guilds.cache.get(guildId).channels;
      channel.cache.get(config.logstruyna).send({ embeds: [embed] });
      return channel.cache.get(config.onlinedtc).send({ embeds: [embed] });
    }
    async function sendNoti(data) {
      var string = "";
      if (data.length > 0) {
        for (const x in data) {
          const { name, steamid, id, reason, time } = data[x];
          string += `#${
            Number(x) + 1
          } [ID:${id}] : ${name} di tu ${time} vi ${reason}\n`;
        }
      } else {
        string += "Danh Sách BlacklIst Trống";
      }
      //* ———————————————[Real Time Page]———————————————
      switch (string) {
        case "Danh Sách BlacklIst Trống":
          await sendNotiRealTime(data, string);
          break;
        default:
          await sendNotiRealTime(data, string);
          var embed = new MessageEmbed()
            .setTitle("DANH SÁCH BLACKLIST")
            .setColor("RED")
            .setDescription(
              "**Danh Sách BlacklIst Online" +
                data.length +
                "**\n\n" +
                "```\n" +
                string +
                "```\n" +
                "Time:" +
                moment().format("MMMM Do YYYY, h:mm:ss a"),
            );
          // Auto Spam
          client.guilds.cache
            .get(guildId)
            .channels.cache.get(config.onlinedtc) //Log Spam thong bao truy na
            .send({ embeds: [embed] });
          break;
      }
      async function sendNotiRealTime(data, string) {
        if (MessageNoti.size > 0) {
          var msgId = MessageNoti.get("truyna");
          const message = await client.guilds.cache
            .get(guildId)
            .channels.cache.get(config.tclist) //Log Thong bao truy na real time
            .messages.fetch(msgId);
          var embed = new MessageEmbed()
            .setTitle("DANH SÁCH BLACKLIST")
            .setColor("RED")
            .setDescription(
              "**Danh Sách BlacklIst Online" +
                data.length +
                "**\n\n" +
                "```\n" +
                string +
                "```\n" +
                "Time:" +
                moment().format("MMMM Do YYYY, h:mm:ss a"),
            );
          return message.edit({ embeds: [embed] });
        } else {
          var embed = new MessageEmbed()
            .setTitle("DANH SÁCH BLACKLIST")
            .setColor("RED")
            .setDescription(
              "**Danh Sách BlacklIst Online" +
                data.length +
                "**\n\n" +
                "```\n" +
                string +
                "```\n" +
                "Time:" +
                moment().format("MMMM Do YYYY, h:mm:ss a"),
            );
          const msg = await client.guilds.cache
            .get(guildId)
            .channels.cache.get(config.tclist) //Log Thong bao truy na
            .send({ embeds: [embed] });
          return MessageNoti.set("truyna", msg.id);
        }
      }
      //* ——————————————————————————————————————————
    }
    async function start() {
      const truyna_data = await truyna.find({ guilid: guildId });
      const data =
        truyna_data.length > 0 ? await findTarget(truyna_data) : false;
      updateTruyNa(data, truyna_data);
    }
    //* ——————————————————————————————————————————

    //* ———————————————[Timeout]———————————————
    setInterval(() => start(), 5 * 1000);
    //* ——————————————————————————————————————————
  });

  client.on("messageCreate", async (msg) => {
    const content = msg.content.toLocaleLowerCase();
    const token = "D869506A6930BD9B713DFA1B40CD4539";
    if (content.startsWith(prefix + "bll")) {
      const data = content
        .split(" ")
        .filter((v) => v.includes(prefix + "bll") < 1);
      const linksteam = data[0];
      const time = data[1];
      const reason = data
        .filter((v) => v !== linksteam)
        .filter((v) => v !== time)
        .join(" ");
      const steam = linksteam.split("/").filter((v) => v.length > 0);
      const summaries = `https://api.steampowered.com/ISteamUser/ResolveVanityURL/v0001/?key=${token}&vanityurl=${
        steam[steam.length - 1]
      }`;
      let queryFilterSteam = steam.filter((v) => v === "id"); // Query Link Steam;
      var embed;
      // query Steam Link > 0 : Link vanity URL
      // Steam Link < 1 : Link Profiles
      if (queryFilterSteam.length > 0) {
        const res = await fetch(summaries).then((res) => res.json());
        let steam_id_dec = res.response.steamid;
        const summariesv2 = `https://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/?key=${token}&steamids=${steam_id_dec}`;
        const respone = await fetch(summariesv2).then((r) => r.json());
        const { personaname, avatarfull } = respone.response.players[0];
        let steam_id_hex = decToHex(steam_id_dec);
        const check = await truyna.findOne({
          guilid: msg.guildId,
          steamid: `steam:${steam_id_hex}`,
        });
        if (check !== null)
          return (
            msg.channel.send(
              "Steam này đang bị blacklist , vui lòng kiểm tra lại",
            ) & msg.react("🚨")
          );
        await truyna.findOneAndUpdate(
          {
            guilid: msg.guildId,
            steamid: "steam:" + steam_id_hex,
          },
          {
            $set: {
              steamid: "steam:" + steam_id_hex,
              guilid: msg.guildId,
              authorid: msg.author.id,
              time: time,
              reason: reason,
              name: personaname,
              listname: [],
            },
          },
          {
            upsert: true,
            new: true,
          },
        );
        embed = new MessageEmbed()
          .setTitle("Blacklisy Mới")
          .setTimestamp()
          .setColor("BLUE")
          .setDescription(
            `Người blacklist: <@${msg.author.id}>\n` +
              `Người bị blacklist: ${personaname}\n` +
              `Lí Do: ${reason}\n` +
              `Thời Gian: \`${time}\`\n` +
              `Link Steam: ` +
              "https://steamcommunity.com/profiles/" +
              `${steam_id_dec}`,
          )
          .setThumbnail(avatarfull);
      } else {
        let steam_id_dec = steam[steam.length - 1];
        const summariesv2 = `https://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/?key=${token}&steamids=${steam_id_dec}`;
        const respone = await fetch(summariesv2).then((r) => r.json());
        const { personaname, avatarfull } = respone.response.players[0];
        let steam_id_hex = decToHex(steam_id_dec);
        const check = await truyna.findOne({
          guilid: msg.guildId,
          steamid: `steam:${steam_id_hex}`,
        });
        if (check !== null)
          return (
            msg.channel.send(
              "Steam này đang bị blacklist , vui lòng kiểm tra lại",
            ) & msg.react("🚨")
          );
        await truyna.findOneAndUpdate(
          {
            guilid: msg.guildId,
            steamid: "steam:" + steam_id_hex,
          },
          {
            $set: {
              steamid: "steam:" + steam_id_hex,
              guilid: msg.guildId,
              authorid: msg.author.id,
              time: time,
              reason: reason,
              name: personaname,
              listname: [],
            },
          },
          {
            upsert: true,
            new: true,
          },
        );
        embed = new MessageEmbed()
          .setTitle("Blacklisy Mới")
          .setTimestamp()
          .setColor("BLUE")
          .setDescription(
            `Người blacklist: <@${msg.author.id}>\n` +
              `Người bị blacklist: ${personaname}\n` +
              `Lí Do: ${reason}\n` +
              `Thời Gian: \`${time}\`\n` +
              `Link Steam: ` +
              "https://steamcommunity.com/profiles/" +
              `${steam_id_dec}`,
          )
          .setThumbnail(avatarfull);
      }
      msg.react("🎉");
      msg.channel.send({
        embeds: [embed],
        content: `<@${msg.author.id}> . bạn đã blacklist thành công`,
      }); // Reply
      client.guilds.cache
        .get(guildId)
        .channels.cache.get(config.logstruyna) // Log Truy na
        .send({ embeds: [embed] });
    } else if (content.startsWith(prefix + "gobll")) {
      const data = content
        .split(" ")
        .filter((v) => v.includes(prefix + "gobll") < 1);
      const linksteam = data[0];
      const reason = data.filter((v) => v !== linksteam).join(" ");
      const steam = linksteam.split("/").filter((v) => v.length > 0);
      const summaries = `https://api.steampowered.com/ISteamUser/ResolveVanityURL/v0001/?key=${token}&vanityurl=${
        steam[steam.length - 1]
      }`;
      let queryFilterSteam = steam.filter((v) => v === "id"); // Query Link Steam;
      var embed;
      // query Steam Link > 0 : Link vanity URL
      // Steam Link < 1 : Link Profiles
      if (queryFilterSteam.length > 0) {
        const res = await fetch(summaries).then((res) => res.json());
        let steam_id_dec = res.response.steamid;
        const summariesv2 = `https://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/?key=${token}&steamids=${steam_id_dec}`;
        const respone = await fetch(summariesv2).then((r) => r.json());
        const { personaname, avatarfull } = respone.response.players[0];
        let steam_id_hex = decToHex(steam_id_dec);
        const check = await truyna.findOne({
          guilid: msg.guildId,
          steamid: `steam:${steam_id_hex}`,
        });
        if (check === null)
          return (
            msg.channel.send(
              "Steam này không có trong danh sách bị blacklist , vui lòng kiểm tra lại",
            ) && msg.react("🚨")
          );
        await truyna.findOneAndDelete({
          guilid: msg.guildId,
          steamid: "steam:" + steam_id_hex,
        });
        embed = new MessageEmbed()
          .setTitle("Gỡ Blacklist")
          .setColor("GREEN")
          .setDescription(
            `Người blacklist: <@${msg.author.id}>\n` +
              `Người bị blacklist: ${personaname}\n` +
              `Lí Do: ${reason}\n` +
              `Link Steam: ` +
              "https://steamcommunity.com/profiles/" +
              `${steam_id_dec}`,
          )
          .setThumbnail(avatarfull);
      } else {
        let steam_id_dec = steam[steam.length - 1];
        const summariesv2 = `https://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/?key=${token}&steamids=${steam_id_dec}`;
        const respone = await fetch(summariesv2).then((r) => r.json());
        const { personaname, avatarfull } = respone.response.players[0];
        let steam_id_hex = decToHex(steam_id_dec);
        const check = await truyna.findOne({
          guilid: msg.guildId,
          steamid: `steam:${steam_id_hex}`,
        });
        if (check === null)
          return (
            msg.channel.send(
              "Steam này không có trong danh sách bị blacklist , vui lòng kiểm tra lại",
            ) && msg.react("🚨")
          );
        await truyna.findOneAndDelete({
          guilid: msg.guildId,
          steamid: "steam:" + steam_id_hex,
        });
        embed = new MessageEmbed()
          .setTitle("Gỡ Blacklist")
          .setColor("GREEN")
          .setDescription(
            `Người blacklist: <@${msg.author.id}>\n` +
              `Người bị blacklist: ${personaname}\n` +
              `Lí Do: ${reason}\n` +
              `Link Steam: ` +
              "https://steamcommunity.com/profiles/" +
              `${steam_id_dec}`,
          )
          .setThumbnail(avatarfull);
      }
      msg.react("🎉");
      msg.channel.send({
        embeds: [embed],
        content: `<@${msg.author.id}> . bạn đã gỡ thành công`,
      }); // Reply
      client.guilds.cache
        .get(guildId)
        .channels.cache.get(config.logstruyna) // Log Truy na
        .send({ embeds: [embed] });
    } else if (content.startsWith(prefix + "listbll")) {
      const data = await truyna.find({ guilid: msg.guildId });
      var field = [];

      if (data.length === 0) {
        field.push({
          name: "DANH SÁCH ĐEN",
          value: "```Không có ai đang bị blacklist```",
          inline: true,
        });
      } else {
        data.forEach((e) => {
          field.push({
            name: `${e.name}`,
            value: `Người blacklist: <@${e.authorid}>\nTime: ${
              e.time
            }\nLý do: ${e.reason}\nTên cũ: ${
              e.listname
            }\nLink steam: ${hexToDec(e.steamid.split(`:`)[1])}`,
            inline: true,
          });
        });
      }

      var embed2 = new MessageEmbed().setFields(field);
      embed2.setDescription("Some").setColor("DARK_VIVID_PINK").setTimestamp();

      msg.channel.send({ embeds: [embed2] });
    }
  });
};
