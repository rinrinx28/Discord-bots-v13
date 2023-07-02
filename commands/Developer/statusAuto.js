const { CommandInteraction, Client } = require("discord.js");
const auto = require("../../schema/auto");
const { SlashCommandBuilder } = require("@discordjs/builders");
module.exports = {
  permission: "ADMINISTRATOR",
  developersOnly: false,
  data: new SlashCommandBuilder()
    .setName("autocheck")
    .setDescription("Bật tắt Auto Check")
    .addBooleanOption((option) => {
      return option
        .setName("status")
        .setDescription("True (Auto On) | False (Auto Off)")
        .setRequired(true);
    }),
  /**
   * @param {CommandInteraction} interaction
   * @param {Client} client
   */
  async execute(interaction, client, ws) {
    let boolean = interaction.options.getBoolean("status");
    boolean === true
      ? ws.send(JSON.stringify({ type: "autocheck", statusAuto: true }))
      : ws.send(JSON.stringify({ type: "autocheck", statusAuto: false }));
    await auto.findOneAndUpdate(
      { guilid: interaction.guildId },
      {
        $set: {
          autocheck: boolean,
        },
      },
      {
        upsert: true,
        new: true,
      },
    );
    return await interaction.reply({
      content: `Bạn đã ${!boolean ? "tắt" : "bật"} Auto Check`,
      ephemeral: true,
    });
  },
};
