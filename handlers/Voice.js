const { Client, MessageEmbed } = require("discord.js");
const voicedb = require("../schema/voicelog");
/**
 * @param {Client} client
 */
module.exports = async (client) => {
  const jointocreatemap = new Map();

  client.on("voiceStateUpdate", async (oldState, newState) => {
    const data = await voicedb.findOne({ guildId: `${newState.guild.id}` });
    if (!data) return;
    var parentid = data.parentj2t;
    var channel = client.channels.cache.get(data.chLog); // logs
    // SET CHANNEL NAME STRING
    //IGNORE BUT DONT DELETE!
    let oldparentname = "unknown";
    let oldchannelname = "unknown";
    let oldchanelid = "unknown";
    if (
      oldState &&
      oldState.channel &&
      oldState.channel.parent &&
      oldState.channel.parent.name
    )
      oldparentname = oldState.channel.parent.name;
    if (oldState && oldState.channel && oldState.channel.name)
      oldchannelname = oldState.channel.name;
    if (oldState && oldState.channelId) oldchanelid = oldState.channelId;
    let newparentname = "unknown";
    let newchannelname = "unknown";
    let newchanelid = "unknown";
    if (
      newState &&
      newState.channel &&
      newState.channel.parent &&
      newState.channel.parent.name
    )
      newparentname = newState.channel.parent.name;
    if (newState && newState.channel && newState.channel.name)
      newchannelname = newState.channel.name;
    if (newState && newState.channelId) newchanelid = newState.channelId;
    if (oldState.channelId) {
      if (typeof oldState.channel.parent !== "undefined")
        oldChannelName = `${oldparentname}\n\t**${oldchannelname}**\n*${oldchanelid}*`;
      else oldChannelName = `-\n\t**${oldparentname}**\n*${oldchanelid}*`;
    }
    if (newState.channelId) {
      if (typeof newState.channel.parent !== "undefined")
        newChannelName = `${newparentname}\n\t**${newchannelname}**\n*${newchanelid}*`;
      else newChannelName = `-\n\t**${newchannelname}**\n*${newchanelid}*`;
    }
    // JOINED V12
    if (!oldState.channelId && newState.channelId) {
      var embed = new MessageEmbed()
        .setAuthor({
          name: `${newState.guild.name} Notify - Join Voice Channel`,
          iconURL: newState.guild.iconURL({ dynamic: true }),
        })
        .setColor("GREEN")
        .setDescription(
          `<@${newState.member.id}> joined voice channel <#${newState.channelId}>`,
        )
        .setFooter({
          text: `Create by ® ${client.user.username}`,
          iconURL: client.user.avatarURL({ dynamic: true }),
        })
        .setThumbnail(newState.guild.iconURL({ dynamic: true }))
        .setTimestamp();
      channel.send({ embeds: [embed] });
      if (newState.channelId === data.j2t) {
        // Tạo Room
        jointocreatechannel2(newState, parentid);
      }
      return;
    }
    // LEFT V12
    if (oldState.channelId && !newState.channelId) {
      var embed = new MessageEmbed()
        .setAuthor({
          name: `${oldState.guild.name} Notify - Left Voice Channel`,
          iconURL: oldState.guild.iconURL({ dynamic: true }),
        })
        .setColor("RED")
        .setDescription(
          `<@${oldState.member.id}> left voice channel <#${oldState.channelId}>`,
        )
        .setFooter({
          text: `Create by ® ${client.user.username}`,
          iconURL: client.user.avatarURL({ dynamic: true }),
        })
        .setThumbnail(oldState.guild.iconURL({ dynamic: true }))
        .setTimestamp();
      channel.send({ embeds: [embed] });
      //get the jointocreatechannel id from the map
      if (
        jointocreatemap.get(
          `tempvoicechannel_${oldState.guild.id}_${oldState.channelId}`,
        )
      ) {
        //fetch it from the guild
        var vc = oldState.guild.channels.cache.get(
          jointocreatemap.get(
            `tempvoicechannel_${oldState.guild.id}_${oldState.channelId}`,
          ),
        );
        //if the channel size is below one
        if (vc.members.size < 1) {
          //delete it from the map
          jointocreatemap.delete(
            `tempvoicechannel_${oldState.guild.id}_${oldState.channelId}`,
          );
          //log that it is deleted
          //delete the voice channel
          return vc.delete();
        } else {
        }
      }
    }
    // Switch v12
    if (oldState.channelId && newState.channelId) {
      if (oldState.channelId !== newState.channelId) {
        var embed = new MessageEmbed()
          .setAuthor({
            name: `${newState.guild.name} Notify - Switch Voice Channel`,
            iconURL: newState.guild.iconURL({ dynamic: true }),
          })
          .setColor("DARK_GOLD")
          .setDescription(
            `<@${newState.member.id}>  switched voice channel <#${oldState.channelId}> to <#${newState.channelId}>`,
          )
          .setFooter({
            text: `Create by ® ${client.user.username}`,
            iconURL: client.user.avatarURL({ dynamic: true }),
          })
          .setThumbnail(newState.guild.iconURL({ dynamic: true }))
          .setTimestamp();
        channel.send({ embeds: [embed] });
        if (newState.channelId === data.j2t) {
          jointocreatechannel2(oldState, parentid);
        }
        //BUT if its also a channel ín the map (temp voice channel)
        if (
          jointocreatemap.get(
            `tempvoicechannel_${oldState.guild.id}_${oldState.channelId}`,
          )
        ) {
          //fetch the channel
          var vc = oldState.guild.channels.cache.get(
            jointocreatemap.get(
              `tempvoicechannel_${oldState.guild.id}_${oldState.channelId}`,
            ),
          );
          //if the size is under 1
          if (vc.members.size < 1) {
            //delete it from the map
            jointocreatemap.delete(
              `tempvoicechannel_${oldState.guild.id}_${oldState.channelId}`,
            );
            //log it
            //delete the room
            return vc.delete();
          } else {
          }
        }
      }
    }
  });

  async function jointocreatechannel2(user, parentid) {
    var vc = await user.guild.channels
      .create(`${user.member.user.username}'s Room G `, {
        type: "GUILD_VOICE",
        parent: parentid, //or set it as a category id
        userLimit: "99",
        permissionOverwrites: [
          {
            id: user.id,
            allow: ["MANAGE_CHANNELS"],
          },
          {
            id: user.guild.id,
            allow: ["VIEW_CHANNEL"],
          },
        ],
      })
      .then(async (vc) => {
        jointocreatemap.set(`tempvoicechannel_${vc.guild.id}_${vc.id}`, vc.id);
        user.setChannel(vc.id);
      });
  }
};
