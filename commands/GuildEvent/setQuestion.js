const { CommandInteraction, MessageEmbed, Client } = require("discord.js");
const { SlashCommandBuilder } = require("@discordjs/builders");
const questiondb = require("../../schema/question");
module.exports = {
  permission: "ADMINISTRATOR",
  developersOnly: false,
  data: new SlashCommandBuilder()
    .setName("setquestion")
    .setDescription("Đặt câu hỏi cho form đăng ký")
    .addStringOption((string) =>
      string.setName("question1").setDescription("Câu hỏi 1").setRequired(true),
    )
    .addStringOption((string) =>
      string.setName("question2").setDescription("Câu hỏi 2").setRequired(true),
    )
    .addStringOption((string) =>
      string.setName("question3").setDescription("Câu hỏi 3").setRequired(true),
    )
    .addStringOption((string) =>
      string.setName("question4").setDescription("Câu hỏi 4").setRequired(true),
    )
    .addStringOption((string) =>
      string.setName("question5").setDescription("Câu hỏi 5").setRequired(true),
    ),
  /**
   * @param {CommandInteraction} interaction
   * @param {Client} client
   */
  async execute(interaction, client) {
    var q1 = interaction.options.get("question1");
    var q2 = interaction.options.get("question2");
    var q3 = interaction.options.get("question3");
    var q4 = interaction.options.get("question4");
    var q5 = interaction.options.get("question5");
    await questiondb.findOneAndUpdate(
      {
        guildId: `${interaction.guildId}`,
      },
      {
        $set: {
          guildId: interaction.guildId,
          question: [
            {
              id: q1.name,
              lable: q1.value,
            },
            {
              id: q2.name,
              lable: q2.value,
            },
            {
              id: q3.name,
              lable: q3.value,
            },
            {
              id: q4.name,
              lable: q4.value,
            },
            {
              id: q5.name,
              lable: q5.value,
            },
          ],
        },
      },
      {
        upsert: true,
        new: true,
      },
    );
    interaction.reply({
      content: "Bạn đã cập nhập thành công các câu hỏi cho Server !",
      ephemeral: true,
    });
  },
};
