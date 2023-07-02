process.env.TZ = "Asia/Ho_Chi_Minh";
const { Client, Collection } = require("discord.js");
const client = new Client({ intents: 32767, disableEveryone: false });
const config = require("./config/main.json");
const { w3cwebsocket } = require("websocket");
const ws = new w3cwebsocket("ws://localhost:8000/discord/websocket");
client.config = config;
client.commands = new Collection();
// require("./handlers/autocheck")(client, ws);
require("./handlers/Events")(client, ws);
require("./handlers/commands")(client);
// require("./handlers/Event")(client);
// require("./handlers/Guild")(client);
// require("./handlers/Voice")(client);
// require("./handlers/Message")(client);
// require("./handlers/dropmenu")(client);
// require("./handlers/MessageReact")(client);
// require("./handlers/Message")(client);
require("./handlers/role_online")(client);
// require("./handlers/truyna")(client);
// require("./handlers/blacklist")(client);
// require("./handlers/CheckOnline")(client);
client.login(config.client_token);

//! ——————————————————[Connect Database]——————————————————
const mongoose = require("mongoose");

mongoose
  .connect(config.db_mongose, {
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Đã kết nối với DB");
  })
  .catch((err) => {
    console.log(err);
  });
mongoose.set("strictQuery", false);

module.exports = {
  client,
};
