const { CommandInteraction, Client, MessageEmbed } = require("discord.js");
const { SlashCommandBuilder } = require("@discordjs/builders");
const presoncheck = require("../../schema/presoncheck");
const { decToHex } = require("number-convert");
const fetch = require("node-fetch");
module.exports = {
  permission: "ADMINISTRATOR",
  developersOnly: false,
  data: new SlashCommandBuilder()
    .setName("deleteuser")
    .setDescription("Xoá User ra khỏi hệ thống kiểm tra Status")
    .addStringOption((option) => {
      return option
        .setName("steamurl")
        .setDescription("URL Steam User")
        .setRequired(true);
    }),
  /**
   * @param {CommandInteraction} interaction
   * @param {Client} client
   */
  async execute(interaction, client, ws) {
    let steam = interaction.options
      .getString("steamurl")
      .split("/")
      .filter((v) => v.length > 0);
    const token = "D869506A6930BD9B713DFA1B40CD4539";
    const summaries = `https://api.steampowered.com/ISteamUser/ResolveVanityURL/v0001/?key=${token}&vanityurl=${
      steam[steam.length - 1]
    }`;
    let queryFilterSteam = steam.filter((v) => v === "id"); // Query Link Steam;
    let steam_id;
    // query Steam Link > 0 : Link vanity URL
    // Steam Link < 1 : Link Profiles
    if (queryFilterSteam.length > 0) {
      const res = await fetch(summaries).then((res) => res.json());
      let steam_id_dec = res.response.steamid;
      let steam_id_hex = decToHex(steam_id_dec);
      await presoncheck.findOneAndDelete({
        steamid: `steam:${steam_id_hex}`,
      });
      steam_id = `steam:${steam_id_hex}`;
    } else {
      let steam_id_dec = steam[steam.length - 1];
      let steam_id_hex = decToHex(steam_id_dec);
      await presoncheck.findOneAndDelete({
        steamid: `steam:${steam_id_hex}`,
      });
      steam_id = `steam:${steam_id_hex}`;
    }
    var channel = interaction.guild.channels.cache.get("1063521432543432815");
    var embed = new MessageEmbed()
      .setColor("RED")
      .setAuthor({
        name: `${interaction.guild.name} - Delete Steam`,
        iconURL: interaction.guild.iconURL({ dynamic: true }),
      })
      .setDescription(
        `${interaction.member.user} đã delete thành công.\n**SteamID:**\n` +
          "`" +
          `${steam_id}` +
          "`\n" +
          "**TimeDelete:**\n" +
          `<t:${Math.floor(new Date().getTime() / 1000.0)}:F>`,
      )
      .setThumbnail(
        interaction.guild.banner
          ? interaction.guild.bannerURL({ size: 1024 })
          : interaction.guild.iconURL({ dynamic: true }),
      )
      .setFooter({
        text: `Create By ${client.user.username}`,
        iconURL: client.user.avatar
          ? client.user.displayAvatarURL({ dynamic: true })
          : null,
      });
    channel.send({ embeds: [embed] });
    return await interaction.reply({
      content: "Bạn đã xoá thành công `" + steam_id + "` ra khỏi hệ thống!",
      ephemeral: true,
    });
  },
};
