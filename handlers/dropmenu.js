const { Client, CommandInteraction, MessageEmbed } = require("discord.js");
const reactMess = require("../schema/reactMess");
const roledb = require("../schema/roledata");
/**
 * @param {Client} client
 */

module.exports = async (client) => {
  /**
   * @param {CommandInteraction} interaction
   */
  client.on("interactionCreate", async (interaction) => {
    if (interaction.isSelectMenu()) {
      let idMess = await reactMess.findOne({ name: interaction.customId });
      if (idMess !== null) {
        var role_react = interaction.values; // Role Đang React
        var role_user = interaction.member.roles.member._roles; // Value type : String[]
        var role_data = await roledb.find({ messName: idMess.name });
        var role_user_has = [];
        //? Find Role user have
        for (const x in role_data) {
          var data_rl = role_user.filter((v) => v === role_data[x].role);
          role_user_has.push(data_rl);
        }
        let role_has_db = role_user_has.flat(); // Role đã có
        let role_del = []; // Role Ko React
        for (const x in role_react) {
          var data = role_has_db
            .filter((v) => v !== role_react[x])
            .map((v) => v);
          role_del.push(data);
        }
        //? Remove Role without.
        let role_remove = role_del.flat();
        for (const x in role_remove) {
          await interaction.member.roles.remove(role_remove[x]);
        }
        //? Add Role into.
        for (const x in role_react) {
          await interaction.member.roles.add(role_react[x]);
        }
        interaction.reply({ content: `🎉`, ephemeral: true });
      }
    }
  });
};
