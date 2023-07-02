const { Client, MessageEmbed } = require("discord.js");
// const medkit = require("../schema/medkit");
const messlogs = require("../schema/messlog");
/**
 * @param {Client} client
 */
module.exports = async (client) => {
  // client.on("messageUpdate", async (oldMessage, newMessage) => {
  //   try {
  //     if (!oldMessage) return;
  //     if (newMessage.author.id === client.user.id) return;
  //     const data = await messlogs.findOne({ guildId: `${newMessage.guildId}` });
  //     if (data == null) return;
  //     var channel = newMessage.guild.channels.cache.get(`${data.chLog}`);
  //     var embed = new MessageEmbed()
  //       .setAuthor({
  //         name: `${newMessage.guild.name} Notify - Cập nhật Tin Nhắn`,
  //         iconURL: newMessage.guild.iconURL({ dynamic: true }),
  //       })
  //       .setColor("GREEN")
  //       .setDescription(
  //         `<@${newMessage.author.id}> đã cập nhập tin nhắn anh/cô ấy ở <#${newMessage.channel.id}>, [Tin Nhắn](${newMessage.url})`,
  //       )
  //       .setFields(
  //         { name: `Tin Nhắn Cũ`, value: `${oldMessage.content}`, inline: true },
  //         {
  //           name: `Tin Nhắn Mới`,
  //           value: `${newMessage.content}`,
  //           inline: true,
  //         },
  //         {
  //           name: `Người Dùng`,
  //           value: `<@${newMessage.author.id}>`,
  //           inline: true,
  //         },
  //       )
  //       .setThumbnail(newMessage.guild.iconURL({ dynamic: true }))
  //       .setFooter({
  //         text: `Create by ® ${client.user.username}`,
  //         iconURL: client.user.avatarURL({ dynamic: true }),
  //       });
  //     if (newMessage.attachments.size > 0) {
  //       embed.addFields({
  //         name: "Image",
  //         value: `[Here](${newMessage.attachments.map((a) => a.url)})`,
  //       });
  //       embed.setImage(`${newMessage.attachments.map((a) => a.url)}`);
  //     }
  //     channel.send({ embeds: [embed] });
  //   } catch (ex) {
  //     console.log(`Error:`, ex);
  //   }
  // });
  // client.on("messageDelete", async (message) => {
  //   try {
  //     if (!message) return;
  //     if (message.author.id === client.user.id) return;
  //     const data = await messlogs.findOne({ guildId: `${message.guildId}` });
  //     if (data == null) return;
  //     var channel = message.guild.channels.cache.get(`${data.chLog}`);
  //     var embed = new MessageEmbed()
  //       .setAuthor({
  //         name: `${message.guild.name} Notify - Tin Nhắn Đã Xóa`,
  //         iconURL: message.guild.iconURL({ dynamic: true }),
  //       })
  //       .setColor("RED")
  //       .setDescription(
  //         `Tin nhắn của <@${message.author.id}> đã bị xóa ở <#${message.channel.id}>`,
  //       )
  //       .setFields(
  //         {
  //           name: `Tin Nhắn Đã Xóa`,
  //           value: `${message?.content}`,
  //           inline: true,
  //         },
  //         {
  //           name: `Người Dùng`,
  //           value: `<@${message?.author.id}>`,
  //           inline: true,
  //         },
  //       )
  //       .setThumbnail(message.guild.iconURL({ dynamic: true }))
  //       .setFooter({
  //         text: `Create by ® ${client.user.username}`,
  //         iconURL: client.user.avatarURL({ dynamic: true }),
  //       });
  //     if (message.attachments.size > 0) {
  //       embed.addFields({
  //         name: "Image",
  //         value: `[Here](${message.attachments.map((a) => a.url)})`,
  //       });
  //       embed.setImage(`${message.attachments.map((a) => a.url)}`);
  //     }
  //     channel.send({ embeds: [embed] });
  //   } catch (ex) {
  //     console.log(`Error:`, ex);
  //   }
  // });
};
