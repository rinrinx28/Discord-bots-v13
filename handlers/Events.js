const { Events } = require("../Validation/EventName");
const { glob } = require("glob");
const { promisify } = require("util");
const globPromise = promisify(glob);
const Ascii = require("ascii-table");
const chalk = require("chalk");
const { version: discordjsVersion, Client } = require("discord.js");
/**
 * @param {Client} client
 */
module.exports = async (client, ws) => {
  const tableEvent = new Ascii("Events Loaded");

  (await globPromise(`${process.cwd()}/Events/*/*.js`)).map(async (file) => {
    const event = require(file);
    if (!Events.includes(event.name) || !event.name) {
      const L = file.split("/");
      await tableEvent.addRow(
        `${event.name || "MISSING"}`,
        `⚠ Event name is missing: ${L[5] + `/` + L[6]}`,
      );
      return;
    }

    if (event.once) {
      client.once(event.name, (...args) => event.execute(...args, client));
    } else {
      client.on(event.name, (...args) => event.execute(...args, client, ws));
    }

    await tableEvent.addRow(event.name, "✔ SUCCESSFUL");
  });

  //! ——————————————————[Console]——————————————————
  console.log(tableEvent.toString());
};
