const { Perms } = require("../Validation/Permission");
const { Client } = require("discord.js");
const { promisify } = require("util");
const { glob } = require("glob");
const pg = promisify(glob);
const Ascii = require("ascii-table");

/**
 * @param {Client} client
 */

module.exports = async (client) => {
  const table = new Ascii("Command Loaded");
  (await pg(`${process.cwd()}/commands/*/*.js`)).map(async (file) => {
    const command = require(file);

    if (!command.data.name)
      return table.addRow(file.split("/")[6], "⚠ Failed", "Missing a name.");
    if (command.permission) {
      if (Perms.includes(command.permission)) command.defaultPermission = false;
      else
        return table.addRow(
          command.data.name,
          "⚠ Failed",
          "Permission is invalid",
        );
    }

    client.commands.set(command.data.name, command);
    await table.addRow(command.data.name, "✔ SUCCESSFUL");
  });

  console.log(table.toString());
};
