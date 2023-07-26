process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
const fetch = require('node-fetch');
const { Client } = require('discord.js');
const MessageEmbed = require('discord.js');
const Discord = require('discord.js');
let url = 'https://103.249.70.30:30120/players.json';
const auto = require('../schema/auto');
const person = require('../schema/presoncheck');
const config = require('../config/main.json');

/**
 * @param {Client} client
 */

module.exports = async (client, ws) => {
	client.on('ready', async () => {
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
			if (data.length < 1 || !data) return { message: 'No Body !' }; //? Kiểm tra dữ liệu
			//* nametag[n] = Name tag
			var allname_data = [];
			for (const x in nametag) {
				var nametag_data = data.filter((v) => v.name.startsWith(nametag[x]));
				allname_data.push(nametag_data);
			}
			filterdata(allname_data, nametag);
			return { message: 'Have Body !' };
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
					data_all.push({ Nametag: nametag[x], data: 'Không Online' });
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
			let channel_id = '1070027734799106128';
			let guild_id = '671956029700964353';
			let guild = client.guilds.cache.get(guild_id);
			let channel = guild.channels.cache.get(channel_id);
			let string_data = '';
			for (const x in data_all) {
				var nametag = data_all[x].Nametag;
				var data = data_all[x].data;

				if (data === 'Không Online') {
					string_data +=
						`**Nametag ${nametag} : 0**\n` + '```\n' + `${data}\n` + '```\n';
				} else {
					if (nametag === 'ACE of Spades') {
						if (data.length > 100) {
							sendError();
						}
					}
					string_data +=
						`**Nametag ${nametag} : ${data.length}** \n` + '```json\n';
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
					string_data += '```\n';
				}
			}
			var embed = new Discord.MessageEmbed()
				.setAuthor({
					name: config.author,
					iconURL: config.logo,
				})
				.setURL(config.link)
				.setColor('#5CDAFF')
				.setThumbnail(config.thumbnail)
				.setFooter({ text: config.footer })
				.setTimestamp()
				.setDescription(string_data);
			channel.send({ embeds: [embed] });
		}

		function sendError() {
			let channel_id = '1062301828101967902'; // chat gang
			let guild_id = '671956029700964353';
			let guild = client.guilds.cache.get(guild_id);
			let channel = guild.channels.cache.get(channel_id);
			var error = '';
			error +=
				'Số lượng người của gang đã vượt quá 30 người. Vui lòng kiểm tra lại list online member <@&1062866375355400423> . ';
			channel.send(error);
		}

		let idSetInterval; //? ID SetInterval (Tắt Auto Check)
		var nametag = ['MED', 'Quân Y', 'QLMED', 'PGĐBS', 'GĐBS'];
		autoCheckNametag(nametag, url);

		/**
		 * @dev Tinh tổng thời gian Online
		 * @n milisecond
		 */
		function timeConvert(n) {
			var d = new Date(n * 1000);
			var h = d.getUTCHours();
			var m = d.getUTCMinutes();
			var s = d.getUTCSeconds();

			return { h: h, m: m, s: s };
		}

		//* ———————————————[Ws Client]———————————————
		const autodb = await auto.find({});
		autodb.length < 1
			? console.log('Auto is off')
			: ws.send(
					JSON.stringify({
						statusAuto: autodb[0].autocheck,
						type: 'autocheck',
					}),
			  );
		ws.onmessage = async (message) => {
			let status = JSON.parse(message.data);
			if (status.type === 'autocheck') {
				if (status.statusAuto === true) {
					var checkauto = await autoCheckNametag(nametag, url);
					if (checkauto !== 'No Body !') {
						var id = setInterval(async () => {
							await autoCheckNametag(nametag, url);
						}, 1e3 * 180);
						idSetInterval = id;
					}
				} else {
					clearInterval(idSetInterval);
				}
			}
		};
	});
};
