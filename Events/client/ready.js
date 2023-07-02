process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
const { Client } = require("discord.js");
const chalk = require("chalk");
let url = "https://51.79.229.155:43221/info.json";
const fetch = require("node-fetch");
module.exports = {
  name: "ready",
  once: false,
  /**
   * @param {Client} client
   */
  execute(client) {
    client.user.setStatus("dnd");
    // setInterval(async () => {
    //   const res = await fetch(url).then((res) => res.text());
    //   const entry = JSON.parse(res);
    //   if (!entry)
    //     return client.user.setActivity({ name: "Server Off", type: "PLAYING" });
    //   var slca = 0;
    //   var slmed = 0;
    //   var slch = 0;
    //   for (let i = 1; i < entry.length; i++) {
    //     let name = entry[i]["name"].toLowerCase().trim();
    //     if (
    //       name.indexOf("ca") == 0 ||
    //       name.indexOf("gđca") == 0 ||
    //       name.indexOf("gdca") == 0 ||
    //       name.indexOf("pgdca") == 0 ||
    //       name.indexOf("pgđca") == 0 ||
    //       name.indexOf("qlca") == 0 ||
    //       name.indexOf("S.W.A.T") == 0 ||
    //       name.indexOf("swat") == 0
    //     )
    //       slca++;
    //     else if (
    //       name.indexOf("med") == 0 ||
    //       name.indexOf("gđbs") == 0 ||
    //       name.indexOf("pgđbs") == 0 ||
    //       name.indexOf("qlmed") == 0 ||
    //       name.indexOf("quân y") == 0
    //     )
    //       slmed++;
    //     else if (
    //       name.indexOf("ch") == 0 ||
    //       name.indexOf("gđch") == 0 ||
    //       name.indexOf("gdch") == 0 ||
    //       name.indexOf("pgđch") == 0 ||
    //       name.indexOf("pgdch") == 0 ||
    //       name.indexOf("qlch") == 0 ||
    //       name.indexOf("pqlch") == 0
    //     )
    //       slch++;
    //   }
    //   client.user.setActivity({
    //     name:
    //       "SERVER ACE:  " +
    //       entry.length +
    //       "/500 👮🏻:" +
    //       slca +
    //       " 👨‍⚕️:" +
    //       slmed +
    //       " 🔧:" +
    //       slch,
    //     type: "PLAYING",
    //   });
    // }, 3000);

    //! ——————————————————[Console]——————————————————
    console.log(
      chalk.gray("Connected To"),
      chalk.yellow(`${client.user.username}#${client.user.discriminator}`),
    );
    console.log(
      chalk.white("Watching"),
      chalk.red(
        `${client.guilds.cache.reduce((a, b) => a + b.memberCount, 0)}`,
      ),
      chalk.white(
        `${
          client.guilds.cache.reduce((a, b) => a + b.memberCount, 0) > 1
            ? "Users,"
            : "User,"
        }`,
      ),
      chalk.red(`${client.guilds.cache.size}`),
      chalk.white(`${client.guilds.cache.size > 1 ? "Servers." : "Server."}`),
    );
  },
};
