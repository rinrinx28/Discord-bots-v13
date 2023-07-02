const { Client, CommandInteraction, MessageEmbed } = require("discord.js");

module.exports = {
  name: "interactionCreate",
  /**
   * @param {CommandInteraction} interaction
   * @param {Client} client
   */
  async execute(interaction, client, ws) {
    if (interaction.isButton()) {
      const id = interaction.customId;
      if (id === "vote_button") {
        // interaction.deferReply();
        const embeds = interaction.message.embeds[0];
        const user = interaction.member.id;
        const value = embeds.description.split(":");
        const counting = value[1].split("**");
        let count = Number(counting[0]) + 1;
        let logs = "1117205431266332742";
        embeds.setDescription(`${value[0]}: ${count} ${counting[1]}`);
        interaction.guild.channels.cache.get(logs).send(`<@${user}> da vote`);
        interaction.reply({ content: "Da vote thanh cong", ephemeral: true });
      }
    }
  },
};
