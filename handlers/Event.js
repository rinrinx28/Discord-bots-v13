const { glob } = require("glob");
const { promisify } = require("util");
const globPromise = promisify(glob);
const Ascii = require("ascii-table");
const { Client } = require("discord.js");
/**
 * @param {Client} client
 */
module.exports = async (client) => {
  const tableEvent = new Ascii("Event Type Loaded");

  (await globPromise(`${process.cwd()}/Event/*.js`)).map(async (file) => {
    const event = require(file);
    if (!event.name) {
      const L = file.split("/");
      await tableEvent.addRow(
        `${event.name || "MISSING"}`,
        `⚠ Event name is missing: ${L[5]}`,
      );
      return;
    }

    if (event.once) {
      client.once(event.name, (...args) => event.execute(...args, client));
    } else {
      client.on(event.name, (...args) => event.execute(...args, client));
    }

    await tableEvent.addRow(event.names, "✔ SUCCESSFUL");
  });
  console.log(tableEvent.toString());
};
