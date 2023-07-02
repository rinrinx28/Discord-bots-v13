const { CommandInteraction, Client } = require("discord.js");
const { SlashCommandBuilder } = require("@discordjs/builders");
const presoncheck = require("../../schema/presoncheck");
module.exports = {
  permission: "ADMINISTRATOR",
  developersOnly: false,
  data: new SlashCommandBuilder()
    .setName("setadmin")
    .setDescription("Thêm quyền cho user")
    .addStringOption((option) => {
      return option
        .setName("discorduserid")
        .setDescription("Discord User ID")
        .setRequired(true);
    }),
  /**
   * @param {CommandInteraction} interaction
   * @param {Client} client
   */
  async execute(interaction, client, ws) {
    let discordid = interaction.options.getString("discorduserid");
    let userCheck = await presoncheck.findOne({
      discordid: interaction.member.id,
      guilid: interaction.guildId,
    });
    /**
     * level = 1 : QTV
     */
    if (userCheck !== null) {
      if (userCheck.level === 1) {
        await presoncheck.findOneAndUpdate(
          {
            discordid: discordid,
            guilid: interaction.guildId,
          },
          {
            $set: {
              level: 1,
            },
          },
        );
        return await interaction.reply({
          content: ` Bạn đã cấp quyền thành công cho <@${discordid}> !`,
        });
      } else
        return await interaction.reply({
          content:
            "Bạn không phải là Quản Trị Viên. Nếu bạn là Quản Trị Viên, bạn có thể liên hệ với Kỷ thuật viên của chúng tôi để report !",
          ephemeral: true,
        });
    } else
      return await interaction.reply({
        content: "Bạn chưa cập nhập thành viên trong hệ thống !",
        ephemeral: true,
      });
  },
};
