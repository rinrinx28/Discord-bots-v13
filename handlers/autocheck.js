process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
const fetch = require("node-fetch");
const { Client, MessageEmbed } = require("discord.js");
let url = "https://51.79.229.155:43221/players.json";
const auto = require("../schema/auto");
const person = require("../schema/presoncheck");
const CheckOnlDem = new Map();
const TongOnlDem = new Map();

/**
 * @param {Client} client
 */

module.exports = async (client, ws) => {
  client.on("ready", async () => {
    /**
     *@dev Lấy dữ liệu từ server thông qua Function getData;
     */
    function getData(url) {
      return fetch(url).then((res) => res.text());
    }

    /**
     * @dev Tự động kiểm tra name tag chỉnh định trong dữ liệu server.
     * @nametag Array
     * @url APIs Server
     * @Time 180000 ms
     */

    async function autoCheckNametag(nametag, url) {
      let res = await getData(url); //? Lấy dữ liệu từ server
      let data = JSON.parse(res); //? Chuyển dữ liệu Text qua JSON
      if (data.length < 1 || !data) return { message: "No Body !" }; //? Kiểm tra dữ liệu
      //* nametag[n] = Name tag
      var allname_data = [];
      for (const x in nametag) {
        var nametag_data = data.filter((v) => v.name.startsWith(nametag[x]));
        allname_data.push(nametag_data);
      }
      filterdata(allname_data, nametag);
      return console.log({ message: "Have Body !" });
    }

    /**
     * @dev Phân tích dữ liệu của Data
     * @data Dữ liệu của Name tag
     * @nametag Array
     */
    async function filterdata(data, nametag) {
      var data_all = [];
      for (const x in data) {
        if (data[x].length < 1) {
          data_all.push({ Nametag: nametag[x], data: "Không Online" });
        } else {
          data_all.push({
            Nametag: nametag[x],
            data: data[x]
              .map((v) => {
                return { name: v.name, id: v.id, ping: v.ping };
              })
              .flat(),
          });
        }
      }
      return sendData(data_all);
    }

    function sendData(data_all) {
      let channel_id = "1044653717225484299";
      let guild_id = "817059262403706891";
      let guild = client.guilds.cache.get(guild_id);
      let channel = guild.channels.cache.get(channel_id);
      let string_data = "";
      for (const x in data_all) {
        var nametag = data_all[x].Nametag;
        var data = data_all[x].data;
        if (data === "Không Online") {
          string_data += `**${nametag}**\n` + "```\n" + `${data}\n` + "```\n";
        } else {
          string_data += `**${nametag}**\n` + "```\n";
          for (const s in data) {
            var id = `[ID:${data[s].id}]`; //? ID.length = 6 (ID: 1) | ID.length = 7 (ID: 22)
            var sl = String(Number(s) + 1);
            string_data += `#${
              sl.length === 1 ? sl.padEnd(sl.length + 1) : sl
            }${
              id.length === 6
                ? id.padStart(id.length + 5)
                : id.length === 7
                ? id.padStart(id.length + 4)
                : id.padStart(id.length + 3)
            }${data[s].name.padStart(data[s].name.length + 3)}\n`;
          }
          string_data += "```\n";
        }
      }
      var embed = new MessageEmbed()
        .setAuthor({
          name: guild.name,
          iconURL: guild.iconURL({ dynamic: true }),
        })
        .setColor("GREEN")
        .setDescription(string_data);
      return channel.send({ embeds: [embed] });
    }

    //* ———————————————[Check Online Dem]———————————————
    /**
     * @description Lọc Nametag Hiện Tại Trong Server
     * @param {Array} nametag
     * @returns {Array}
     */
    async function getUserInServer(nametag) {
      const res = await getData(url); //? Lấy dữ liệu từ server
      const data = JSON.parse(res); //? Chuyển dữ liệu Text qua JSON
      if (data.length < 1 || !data) return { message: "No Body !" }; //? Kiểm tra dữ liệu
      // console.log(data);
      let data_user = [];
      nametag.forEach((v) => {
        const user = data.filter((s) =>
          s.name
            .split("|")
            .filter((x) => x.length > 0)[0]
            .toLowerCase()
            .startsWith(v.toLowerCase()),
        );
        user.forEach((v) => data_user.push(v));
      });
      return data_user;
    }
    /**
     * @description Send dữ liệu tới channel
     * @param {Array} data
     * @param {boolean} type True: Tong Time Ket Thuc | False: User Out
     * @returns {message}
     */
    function sendDatas(data, type) {
      if (data.length < 1) return;
      // {
      //   name: k.name,
      //   interface: k.identifiers,
      //   TongTime: { hours: h, minutes: m, seconds: s },
      // }
      let channel_id = "1063521432543432815";
      let guild_id = "1034209710930415729";
      let guild = client.guilds.cache.get(guild_id);
      let channel = guild.channels.cache.get(channel_id);
      if (type) {
        data.forEach((v) => {
          let string =
            v.name +
            "\n" +
            "da Online voi tong Time:\n" +
            `Hours: ${v.TongTime.hours} Minutes: ${v.TongTime.minutes} Seconds: ${v.TongTime.seconds}` +
            "\n";
          channel.send(string);
        });
        return;
      } else {
        data.forEach((v) => {
          let string =
            v.name +
            " da out voi \n" +
            "Time Online:\n" +
            `Hours: ${v.TongTime.hours} Minutes: ${v.TongTime.minutes} Seconds: ${v.TongTime.seconds}` +
            "\n";
          channel.send(string);
        });
        return;
      }
    }
    /**
     * @description Send dữ liệu tới channel
     * @param {boolean} type True: Start | False: End
     * @returns {message}
     */
    function sendNoti(type) {
      let channel_id = "1063521432543432815";
      let guild_id = "1034209710930415729";
      let guild = client.guilds.cache.get(guild_id);
      let channel = guild.channels.cache.get(channel_id);
      if (type) {
        channel.send("Bat Tu Dong Kiem Tra Online Dem");
        return;
      } else {
        channel.send("Ket Thuc Kiem Tra Online Dem");
        return;
      }
    }
    //* ——————————————————————————————————————————

    let idSetInterval; //? ID SetInterval (Tắt Auto Check)
    var nametag = ["MED", "Quân Y", "QLMED", "PGDBS", "GĐBS"];
    let startCheckDem = false;
    // Thong Bao tu dong
    setInterval(async () => {
      let options = { timeZone: "Asia/Ho_Chi_Minh" };
      const getHour = Number(
        new Date().getHours().toLocaleString("en-US", options),
      ); // Định dạng giờ là 24 giờ theo US
      const getminutes = Number(
        new Date().getMinutes().toLocaleString("en-US", options),
      );
      const getSeconds = Number(
        new Date().getSeconds().toLocaleString("en-US", options),
      );
      if (getHour === 0 && getminutes === 0 && getSeconds === 0) {
        return sendNoti(true);
      } else if (getHour === 6 && getminutes === 0 && getSeconds === 0) {
        return sendNoti(false);
      }
    }, 1e3 * 1);
    // Check Onl Dem Tu Dong
    setInterval(async () => {
      var nametag = ["MED", "QLMED"];
      let options = { timeZone: "Asia/Ho_Chi_Minh" };
      const getHour = Number(
        new Date().getHours().toLocaleString("en-US", options),
      ); // Định dạng giờ là 24 giờ theo US
      const getminutes = Number(
        new Date().getMinutes().toLocaleString("en-US", options),
      );
      // Start Code
      if (getHour === 2 && getminutes === 0) {
        // Điều Kiện Giờ = 00 (12h Theo VN)
        startCheckDem = true;
      } else if (getHour === 2 && getminutes === 0) {
        startCheckDem = false;
        if (CheckOnlDem.size < 1 && TongOnlDem.size < 1) return;
        // Điều Kiện Giờ = 1 (1 Sáng Theo VN)
        // Get All Data In Check Dem
        let data = [];
        CheckOnlDem.forEach(function (v, k, map) {
          // Check Tong Onl Dem;
          if (TongOnlDem.has(k)) {
            var { Sum } = TongOnlDem.get(k);
            let now = Math.floor(new Date().getTime() / 1000.0);
            const { h, m, s } = timeConvert(now - v.TimeIn + Sum);
            data.push({
              name: `${v.name} (${k}) ID: ${v.id}`,
              TongTime: { hours: h, minutes: m, seconds: s },
            });
            TongOnlDem.delete(k);
          } else {
            var { TimeIn, Sum, name, id } = v;
            let now = Math.floor(new Date().getTime() / 1000.0);
            let Tsum = now - TimeIn + Sum;
            const { h, m, s } = timeConvert(Tsum);
            data.push({
              name: `${name} (${k}) ID: ${id}`,
              TongTime: { hours: h, minutes: m, seconds: s },
            });
          }
        });
        TongOnlDem.forEach(function (v, k, map) {
          var { Sum, name, id } = v;
          const { h, m, s } = timeConvert(Sum);
          data.push({
            name: `${name} (${k}) ID: ${id}`,
            TongTime: { hours: h, minutes: m, seconds: s },
          });
        });
        sendDatas(data, true);
        TongOnlDem.clear();
        return CheckOnlDem.clear();
      }
      if (startCheckDem) {
        const data = await getUserInServer(nametag);
        let data_dem = [];
        let data_sv_dem = [];
        // Check In
        data.forEach((v) => {
          let key = v.identifiers.filter((x) => x.startsWith("steam"))[0];
          data_sv_dem.push(key);
          if (!CheckOnlDem.has(key)) {
            CheckOnlDem.set(key, {
              TimeIn: Math.floor(new Date().getTime() / 1000.0),
              TimeOut: 0,
              Sum: 0,
              name: v.name,
              id: v.id,
            });
          }
        });
        // Them Du Lieu Vao Array Kiem tra Out
        CheckOnlDem.forEach((v, k, map) => {
          data_dem.push(k);
        });
        //Check Out
        const userOut = data_dem.filter((x) => !data_sv_dem.includes(x));
        if (userOut.length > 0) {
          // Lay du lieu Cu va Tinh TimeSum
          let data_out = [];
          userOut.forEach((v) => {
            const data_old_user = CheckOnlDem.get(v);
            CheckOnlDem.set(v, {
              TimeIn: 0,
              TimeOut: Math.floor(new Date().getTime() / 1000.0),
              Sum:
                Math.floor(new Date().getTime() / 1000.0) -
                data_old_user.TimeIn,
              name: data_old_user.name,
              id: data_old_user.id,
            });
            const data_user_out = CheckOnlDem.get(v);
            if (TongOnlDem.has(v)) {
              const data_old = TongOnlDem.get(v);
              let tsum =
                Math.floor(new Date().getTime() / 1000.0) -
                data_old_user.TimeIn +
                data_old.Sum;
              TongOnlDem.set(v, {
                TimeIn: 0,
                TimeOut: Math.floor(new Date().getTime() / 1000.0),
                Sum: tsum,
                name: data_old_user.name,
                id: data_old_user.id,
              });
              CheckOnlDem.delete(v);
              const { h, m, s } = timeConvert(tsum);
              data_out.push({
                name: `${data_user_out.name} (${v}) ID: ${data_user_out.id}`,
                TongTime: { hours: h, minutes: m, seconds: s },
              });
            } else {
              TongOnlDem.set(v, data_user_out);
              CheckOnlDem.delete(v);
              const { h, m, s } = timeConvert(data_user_out.Sum);
              data_out.push({
                name: `${data_user_out.name} (${v}) ID: ${data_user_out.id}`,
                TongTime: { hours: h, minutes: m, seconds: s },
              });
            }
          });
          return sendDatas(data_out, false);
        }
      }
      // End Code;
    }, 1e3 * 1);
    // autoCheckNametag(nametag, url);
    //* ———————————————[Ws Client]———————————————
    // const autodb = await auto.find({});
    // autodb.length < 1
    //   ? console.log("Auto is off")
    //   : ws.send(
    //       JSON.stringify({
    //         statusAuto: autodb[0].autocheck,
    //         type: "autocheck",
    //       }),
    //     );
    // ws.onmessage = async (message) => {
    //   let status = JSON.parse(message.data);
    //   if (status.type === "autocheck") {
    //     if (status.statusAuto === true) {
    //       var checkauto = await autoCheckNametag(
    //         nametag,
    //         url,
    //       );
    //       if (checkauto !== "No Body !") {
    //         var id = setInterval(async () => {
    //           await autoCheckNametag(nametag, url);
    //         }, 1e3 * 180);
    //         idSetInterval = id;
    //       }
    //     } else {
    //       clearInterval(idSetInterval);
    //     }
    //   }
    // };
    //* ——————————————————————————————————————————
    // var idInterval = setInterval(async () => {
    //   const db = await person.find({ guilid: "1034209710930415729" });
    //   if (db.length < 1) return;
    //   await getAllDataAndFind(url, db);
    // }, 1e3 * 5);
  });
};
