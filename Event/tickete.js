const {
  Client,
  CommandInteraction,
  MessageEmbed,
  MessageActionRow,
  MessageButton,
  Modal,
  TextInputComponent,
} = require("discord.js");
const ticketdb = require("../schema/ticketdb");
const questiondb = require("../schema/question");
const { createTranscript } = require("discord-html-transcripts");
const { logsTicket } = require("../config/main.json");
const CrytoJs = require("crypto-js");
const fs = require("fs");

module.exports = {
  name: "interactionCreate",
  names: "Ticket Event",
  /**
   * @param {CommandInteraction} interaction
   * @param {Client} client
   */
  async execute(interaction, client) {
    var button = new MessageActionRow().addComponents(
      new MessageButton()
        .setCustomId("close")
        .setStyle("SUCCESS")
        .setLabel("Close Ticket")
        .setEmoji("🗑"),
    );

    var buttons = (status) => [
      new MessageActionRow().addComponents(
        new MessageButton()
          .setCustomId("transcripts")
          .setEmoji("🖨")
          .setLabel("Xoá Ticket")
          .setDisabled(status)
          .setStyle("SECONDARY"),
      ),
    ];

    // const form = [
    //   {
    //     ID: "name",
    //     LABEL: "Họ và Tên / Ngày tháng năm Sinh ? ",
    //     MIN_LENGTH: 0,
    //     MAX_LENGTH: 200,
    //     PLACE_HOLDER: "Vui lòng ghi rõ thông tin.",
    //     REQUIRED: true,
    //   },
    //   {
    //     ID: "nguoi",
    //     LABEL: "Ai là người giới thiệu bạn đến nhóm ?",
    //     MIN_LENGTH: 0,
    //     MAX_LENGTH: 200,
    //     PLACE_HOLDER: "Vui lòng ghi rõ thông tin,",
    //     REQUIRED: true,
    //   },
    //   {
    //     ID: "sung",
    //     LABEL: "Súng đang sở hữu (nếu có) ? ",
    //     MIN_LENGTH: 0,
    //     MAX_LENGTH: 200,
    //     PLACE_HOLDER: "Vui lòng ghi rõ thông tin.",
    //     REQUIRED: true,
    //   },
    //   {
    //     ID: "gang",
    //     LABEL: "Các gang, team của server đã từng tham gia ?",
    //     MIN_LENGTH: 0,
    //     MAX_LENGTH: 200,
    //     PLACE_HOLDER: "Vui lòng ghi rõ thông tin.",
    //     REQUIRED: true,
    //   },
    //   {
    //     ID: "steam",
    //     LABEL: "Link steam bạn là gì ?",
    //     MIN_LENGTH: 0,
    //     MAX_LENGTH: 200,
    //     PLACE_HOLDER: "Vui lòng ghi rõ thông tin.",
    //     REQUIRED: true,
    //   },
    // ];

    //! ----------------------------------------
    const new1 = [
      {
        ID: "ten",
        LABEL: "Tên của bạn là gì ? ",
        MIN_LENGTH: 0,
        MAX_LENGTH: 200,
        PLACE_HOLDER: "Vui lòng ghi rõ thông tin.",
        REQUIRED: true,
      },
      {
        ID: "who",
        LABEL: "Bạn muốn report gì ?",
        MIN_LENGTH: 0,
        MAX_LENGTH: 200,
        PLACE_HOLDER: "Vui lòng ghi rõ thông tin,",
        REQUIRED: true,
      },
    ];
    //! ----------------------------------------

    if (interaction.isButton()) {
      var btnid = interaction.customId;
      if (btnid === "cticket") {
        var input = [];
        const form = await questiondb.findOne({ guildId: interaction.guildId });
        if (!form)
          return interaction.reply({
            content:
              "Server hiện tại chưa có câu hỏi, xin vui lòng liên hệ BQL để xử lý !",
          });
        form.question.map((v) => {
          var row = new MessageActionRow().addComponents(
            new TextInputComponent()
              .setCustomId(v.id)
              .setLabel(v.lable)
              .setMinLength(0)
              .setMaxLength(200)
              .setPlaceholder("Vui lòng ghi rõ thông tin.")
              .setRequired(true)
              .setStyle("SHORT"),
          );
          input.push(row);
        });
        var modal = new Modal()
          .setCustomId("form")
          .setTitle("Đơn Xin Tham Gia")
          .addComponents(input);
        interaction.showModal(modal);
      }

      if (btnid === "creport") {
        var input = [];
        new1.map((v) => {
          var row = new MessageActionRow().addComponents(
            new TextInputComponent()
              .setCustomId(v.ID)
              .setLabel(v.LABEL)
              .setMinLength(v.MIN_LENGTH)
              .setMaxLength(v.MAX_LENGTH)
              .setPlaceholder(v.PLACE_HOLDER)
              .setRequired(v.REQUIRED)
              .setStyle("SHORT"),
          );
          input.push(row);
        });
        var modal = new Modal()
          .setCustomId("new1")
          .setTitle("Đơn tố cáo")
          .addComponents(input);
        interaction.showModal(modal);
      }

      if (btnid === "close") {
        if (!interaction.memberPermissions.has("MANAGE_CHANNELS"))
          return interaction.reply({
            content: `Hey ${interaction.user.username}, bạn không có quyền xóa ticket chỉ có BQL xóa.`,
            ephemeral: true,
          });
        const guild = client.guilds.cache.get(interaction.guildId);
        const chan = guild.channels.cache.get(interaction.channelId);
        const logsTicketdb = await ticketdb.findOne({
          guildId: interaction.guildId,
        });
        if (!logsTicketdb)
          return interaction.reply({
            content:
              "Server của bạn hiện không có đăng ký hoặc nhập Log Ticket",
          });
        const attachmemt = await createTranscript(chan, {
          limit: -1,
          returnBuffer: false,
          fileName: `${chan.name}.html`,
        });
        var ticketid = CrytoJs.AES.encrypt(chan.topic, "rindev");
        var ticket_decode =
          ticketid.toString().slice(0, 8 - 1) +
          ticketid
            .toString()
            .slice(ticketid.toString().length - 8, ticketid.toString().length);
        fs.writeFileSync(
          `../Ticket-App/ticket-file/${ticket_decode}.html`,
          attachmemt.attachment.toString("utf8"),
        );
        var embed = new MessageEmbed()
          .setAuthor({
            name: `${interaction.guild.name} • Ticket Logs`,
            iconURL: interaction.guild.iconURL({ dynamic: true }),
          })
          .setColor("GREEN")
          .addFields(
            { name: "Ticket ID", value: ticket_decode, inline: true },
            {
              name: "Opened By",
              value: interaction.guild.members.cache.get(chan.topic).user
                .username,
              inline: true,
            },
            {
              name: "Closed By",
              value: interaction.member.user.username,
              inline: true,
            },
            {
              name: "Open Time",
              value: `<t:${chan.createdTimestamp}:f> `,
              inline: true,
            },
            {
              name: "Claimed By",
              value: interaction.member.user.username,
              inline: true,
            },
          )
          .setTimestamp()
          .setFooter({
            text: `Create By ${client.user.username}`,
            iconURL: client.user.displayAvatarURL({ dynamic: true }),
          });
        var btn_view = new MessageActionRow().addComponents(
          new MessageButton()
            .setStyle("LINK")
            .setLabel("View Online Transcript")
            .setURL(`https://brzone.xyz/ticketview/${ticket_decode}`)
            .setEmoji("📁"),
        );
        guild.channels.cache
          .get(logsTicketdb.chLog)
          .send({ embeds: [embed], components: [btn_view] });
        interaction.reply({
          content: `Ticket này sẽ xóa trong 5 giây 🔆 **<@!${chan.topic}>**`,
        });
        setTimeout(() => chan.delete(), 1e3 * 10);
      }
      if (btnid === "transcripts") {
        interaction.editReply({ components: buttons(true) });
        var embed = new MessageEmbed()
          .setAuthor({
            name: `${interaction.guild.name} - Transcripts Ticket`,
            iconURL: client.user.displayAvatarURL({ dynamic: true }),
          })
          .setColor("#FF8989")
          .setDescription(
            "Bạn có muốn lưu lại lịch sử Ticket Không ?\n\n Nếu bạn muốn lưu lại lịch sử Ticket vui lòng bấm vào **Close Ticket**.\nXin cảm ơn !",
          )
          .setFooter({
            text: `Create by ${client.user.username}`,
            iconURL: client.user.displayAvatarURL({ dynamic: true }),
          });
        interaction.reply({ embeds: [embed], components: [button] });
      }
    }

    if (interaction.isModalSubmit()) {
      if (interaction.customId === "form") {
        var arr = [];
        const form = await questiondb.findOne({ guildId: interaction.guildId });
        form.question.map((v) =>
          arr.push(interaction.fields.getField(v.id), { lable: v.lable }),
        );
        var string = "";
        for (const x in arr) {
          for (const s in form.question) {
            if (arr[x].customId === form.question[s].id) {
              string +=
                `**${form.question[s].lable}**\n` +
                "```\n" +
                `${arr[x].value}\n` +
                "```\n";
            }
          }
        }
        var embed = new MessageEmbed()
          .setAuthor({
            name: `🔱 V I C T O R Y ! 🔱 - Ticket Support 🎫`,
            iconURL: client.user.displayAvatarURL({ dynamic: true }),
          })

          .setDescription(string)
          .setTitle(
            "—————<a:tl1heartyellow:1062193119128469505>  Đơn Xin Tham Gia Nhóm <a:tl1heartyellow:1062193119128469505>—————",
          )
          .setColor("#FFFF00")
          .setThumbnail(
            "https://media.discordapp.net/attachments/1039636369649184799/1062180312903323789/VictoryTeam.png?width=586&height=586",
          )
          .setFooter({
            text: `${client.user.username}`,
            iconURL: client.user.displayAvatarURL({ dynamic: true }),
          })
          .setTimestamp();

        var checkTicket = interaction.guild.channels.cache.find(
          (c) => c.topic === interaction.user.id,
        );
        if (checkTicket !== undefined)
          return interaction.reply({
            content: `Hey ${interaction.user.username}, bạn đã có một ticket, Đây là Ticket > <#${checkTicket.id}> !`,
            ephemeral: true,
          });
        var cTicket = await interaction.guild.channels.create(
          `ticket ${interaction.user.username}`,
          {
            type: "text",
            parent: interaction.channel.parentId, // category
            topic: interaction.user.id,
            permissionOverwrites: [
              {
                id: interaction.guild.id,
                deny: ["VIEW_CHANNEL"],
              },
              {
                id: interaction.user.id,
                allow: ["VIEW_CHANNEL"],
              },
            ],
          },
        );

        interaction.reply({
          content: `Hey ${interaction.user.username}, Ticket của bạn <#${cTicket.id}>`,
          ephemeral: true,
        });

        cTicket.send({
          content: `Cám ơn <@${interaction.user.id}> đã nộp đơn, vui lòng đợi BQL xem xét và trả lời bạn nhanh nhất có thể `,
          embeds: [embed],
          components: buttons(false),
        });
      } else if (interaction.customId === "new1") {
        var arr = [];
        new1.map((v) =>
          arr.push(interaction.fields.getField(v.ID), { lable: v.LABEL }),
        );
        var string1 = "";
        for (const x in arr) {
          for (const s in new1) {
            if (arr[x].customId === new1[s].ID) {
              string1 +=
                `**${new1[s].LABEL}**\n` +
                "```\n" +
                `${arr[x].value}\n` +
                "```\n";
            }
          }
        }
        var embed = new MessageEmbed()
          .setAuthor({
            name: `🔱 V I C T O R Y ! 🔱 - Ticket Support 🎫`,
            iconURL: client.user.displayAvatarURL({ dynamic: true }),
          })

          .setDescription(string1)
          .setTitle(
            "—————<a:tl1heartyellow:1062193119128469505>  Đơn Tố Cáo <a:tl1heartyellow:1062193119128469505>—————",
          )
          .setColor("#FFFF00")
          .setThumbnail(
            "https://media.discordapp.net/attachments/1039636369649184799/1062180312903323789/VictoryTeam.png?width=586&height=586",
          )
          .setFooter({
            text: `${client.user.username}`,
            iconURL: client.user.displayAvatarURL({ dynamic: true }),
          })
          .setTimestamp();

        var checkTicket = interaction.guild.channels.cache.find(
          (c) => c.topic === interaction.user.id,
        );
        if (checkTicket !== undefined)
          return interaction.reply({
            content: `Hey ${interaction.user.username}, bạn đã có một ticket, Đây là Ticket > <#${checkTicket.id}> !`,
            ephemeral: true,
          });
        var creport = await interaction.guild.channels.create(
          `ticket ${interaction.user.username}`,
          {
            type: "text",
            parent: interaction.channel.parentId, // category
            topic: interaction.user.id,
            permissionOverwrites: [
              {
                id: interaction.guild.id,
                deny: ["VIEW_CHANNEL"],
              },
              {
                id: interaction.user.id,
                allow: ["VIEW_CHANNEL"],
              },
            ],
          },
        );

        interaction.reply({
          content: `Hey ${interaction.user.username}, Ticket của bạn <#${creport.id}>`,
          ephemeral: true,
        });

        creport.send({
          content: `Chào <@${interaction.user.id}>, cám ơn bạn đã report . Vui lòng đợi  `,
          embeds: [embed],
          components: buttons(false),
        });
      }
    }
  },
};
