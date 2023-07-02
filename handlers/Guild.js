const { Client, MessageEmbed, MessageAttachment } = require("discord.js");
const guildEvents = require("../schema/GuildAdd");
const Canvas = require("canvas");
Canvas.registerFont("./font/aAbsoluteEmpire.ttf", {
  family: "aAbsoluteEmpire",
});
/**
 * @param {Client} client
 */
module.exports = async (client) => {
  client.on("guildMemberAdd", async (member) => {
    const guilds = await guildEvents.findOne({ guildId: member.guild.id });
    // console.log(guilds);
    if (!guilds) return;
    if (guilds.guildId !== member.guild.id) return;

    //TODO ——————————————————[Start Canvas]——————————————————
    var welcome = {};
    welcome.create = Canvas.createCanvas(1024, 500);
    welcome.context = welcome.create.getContext("2d");
    welcome.context.fillStyle = "#fff";

    let banner;

    if (member.guild.banner) {
      banner = member.guild.bannerURL({ format: "png", size: 1024 });
    } else
      banner =
        "https://images.wallpapersden.com/image/wxl-topography-abstract-black-texture_64113.jpg";

    var img = await Canvas.loadImage(banner);
    welcome.context.drawImage(img, 0, 0, 1024, 500);
    welcome.context.filter = "blur(4px)";
    welcome.context.beginPath();
    welcome.context.arc(512, 166, 128, 0, Math.PI * 2, true);
    welcome.context.stroke();
    welcome.context.fill();
    welcome.context.font = '72px "aAbsoluteEmpire"';
    welcome.context.fillText("Welcome", 330, 360);

    let canvas = welcome;
    canvas.context.font = '42px "aAbsoluteEmpire"';
    canvas.context.textAlign = "center";
    canvas.context.fillText(member.user.tag.toUpperCase(), 512, 410);
    canvas.context.font = '32px "aAbsoluteEmpire"';
    canvas.context.fillText(` Member #${member.guild.memberCount}`, 512, 455);
    canvas.context.beginPath();
    canvas.context.arc(512, 166, 119, 0, Math.PI * 2, true);
    canvas.context.closePath();
    canvas.context.clip();
    await Canvas.loadImage(
      member.user.displayAvatarURL({ format: "png", size: 1024 }),
    ).then((img) => {
      canvas.context.drawImage(img, 393, 47, 238, 238);
    });

    let atata = new MessageAttachment(
      canvas.create.toBuffer(),
      `welcome-${member.id}.png`,
    );
    let chjoin = member.guild.channels.cache.get(`${guilds.ch_join}`);
    chjoin.send({ files: [atata] });

    //TODO ——————————————————[End Canvas]——————————————————

    //TODO ——————————————————[Logs Member]——————————————————
    var logs = member.guild.channels.cache.get(`${guilds.chLog}`);
    var logembed = new MessageEmbed()
      .setAuthor({
        name: `${member.user.tag} - (${member.user.id})`,
        iconURL: member.user.displayAvatarURL({ dynamic: true }),
      })
      .setColor("GREEN")
      .setDescription(
        `• Username: <@${member.user.id}> - ${member.user.tag} (${member.user.id})\n` +
          `• Created: <t:${Math.floor(
            member.user.createdTimestamp / 1000.0,
          )}:F> <t:${Math.floor(member.user.createdTimestamp / 1000.0)}:R> \n` +
          `• Joined: <t:${Math.floor(
            new Date().getTime() / 1000.0,
          )}:F> - <t:${Math.floor(new Date().getTime() / 1000.0)}:R> \n`,
      )
      .setFooter({
        text: `Create by ® ${client.user.username} • Join`,
        iconURL: client.user.avatarURL({ dynamic: true }),
      })
      .setThumbnail(member.user.displayAvatarURL({ dynamic: true }));
    logs.send({ embeds: [logembed] });
    //TODO ——————————————————[Role Add]——————————————————
    if (!guilds.role) return;
    var role = member.guild.roles.cache.get(`${guilds.role}`);
    member.roles.add(role);
  });

  client.on("guildMemberRemove", async (member) => {
    const guilds = await guildEvents.findOne({ guildId: member.guild.id });
    if (!guilds) return;
    if (guilds.guildId !== member.guild.id) return;
    //TODO ——————————————————[Start Canvas]——————————————————
    var goodbye = {};
    goodbye.create = Canvas.createCanvas(1024, 500);
    goodbye.context = goodbye.create.getContext("2d");
    goodbye.context.fillStyle = "#fff";

    let banner;

    if (member.guild.banner) {
      banner = member.guild.bannerURL({ format: "png", size: 1024 });
    } else
      banner =
        "https://images.wallpapersden.com/image/wxl-topography-abstract-black-texture_64113.jpg";

    var img = await Canvas.loadImage(banner);
    goodbye.context.drawImage(img, 0, 0, 1024, 500);
    goodbye.context.filter = "blur(4px)";
    goodbye.context.beginPath();
    goodbye.context.arc(512, 166, 128, 0, Math.PI * 2, true);
    goodbye.context.stroke();
    goodbye.context.fill();
    goodbye.context.font = '72px "aAbsoluteEmpire"';
    goodbye.context.fillText("Goodbye", 330, 360);

    let canvas = goodbye;
    canvas.context.font = '42px "aAbsoluteEmpire"';
    canvas.context.textAlign = "center";
    canvas.context.fillText(member.user.tag.toUpperCase(), 512, 410);
    canvas.context.font = '32px "aAbsoluteEmpire"';
    canvas.context.fillText(` Member #${member.guild.memberCount}`, 512, 455);
    canvas.context.beginPath();
    canvas.context.arc(512, 166, 119, 0, Math.PI * 2, true);
    canvas.context.closePath();
    canvas.context.clip();
    await Canvas.loadImage(
      member.user.displayAvatarURL({ format: "png", size: 1024 }),
    ).then((img) => {
      canvas.context.drawImage(img, 393, 47, 238, 238);
    });

    let atata = new MessageAttachment(
      canvas.create.toBuffer(),
      `goodbye-${member.id}.png`,
    );

    //TODO ——————————————————[End Canvas]——————————————————

    let chleave = member.guild.channels.cache.get(`${guilds.ch_leave}`);
    chleave.send({ files: [atata] });

    //TODO ——————————————————[Logs Member]——————————————————
    var logs = member.guild.channels.cache.get(`${guilds.chLog}`);
    var logleave = new MessageEmbed()
      .setAuthor({
        name: `${member.user.tag} - (${member.user.id})`,
        iconURL: member.user.displayAvatarURL({ dynamic: true }),
      })
      .setColor("RED")
      .setDescription(
        `• Username: <@${member.user.id}> - ${member.user.tag} (${member.user.id})\n` +
          `• Created: <t:${Math.floor(
            member.user.createdTimestamp / 1000.0,
          )}:F> <t:${Math.floor(member.user.createdTimestamp / 1000.0)}:R> \n` +
          `• Left: <t:${Math.floor(
            new Date().getTime() / 1000.0,
          )}:F> - <t:${Math.floor(new Date().getTime() / 1000.0)}:R> \n`,
      )
      .setFooter({
        text: `Create by ® ${client.user.username} • Left`,
        iconURL: client.user.avatarURL({ dynamic: true }),
      })
      .setThumbnail(member.user.displayAvatarURL({ dynamic: true }));
    logs.send({ embeds: [logleave] });
  });
};
