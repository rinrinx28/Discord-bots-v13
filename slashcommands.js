const { promisify } = require("util");
const { glob } = require("glob");
const pg = promisify(glob);
const { REST } = require("@discordjs/rest");
const { Routes } = require("discord-api-types/v10");
const { client_token } = require("./config/main.json");
const clientId = "1090781644379660318";

const rest = new REST({ version: "10" }).setToken(client_token);

async function getFile() {
  const commands = [];
  (await pg(`${process.cwd()}/commands/*/*.js`)).map(async (file) => {
    const command = require(file);
    commands.push(command.data.toJSON());
    return command;
  });

  try {
    await rest.put(Routes.applicationCommands(clientId), { body: commands });
    console.log("Successfully registered application commands.");
  } catch (e) {
    console.log("Error:", e);
  }
}
getFile();
