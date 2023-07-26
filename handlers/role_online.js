// Make scripts allow user to update time online of user in database if user online have in data api server when fecth data

const {
	Client,
	MessageEmbed,
	MessageActionRow,
	MessageButton,
} = require('discord.js');

/**
 *
 * @param {Client} client
 */
module.exports = async (client) => {
	// Create function to fetch data with api server

	var cron = require('node-cron');
	const fetch = require('node-fetch');
	const rOnline = require('../schema/role_online');
	const time_mean = require('../schema/time_mean');
	cron.schedule(
		'0 0 * * Mon',
		async () => {
			const data = await rOnline.find();
			data.forEach(async (v) => {
				await rOnline.findOneAndUpdate(
					{ idDiscord: v.idDiscord },
					{ timeOnline: 0, timejoin: 0, timeleave: 0 },
					{ new: true, upsert: true },
				);
			});
			client.guilds.cache
				.get(guildId)
				.channels.cache.get(config.tclist)
				.send('Da update!');
		},
		{ scheduled: true, timezone: 'Asia/Ho_Chi_Minh' },
	);
	// Create function to update time online of user in database with role id
	const update = async () => {
		// Fetch data
		const res = await fetch('Change your URL');
		const data = await res.json();
		const data_db = await rOnline.find();
		// check different between data in database and data in api server
		const data_user = data.map((user) => {
			const idDiscord = user.identifiers
				.filter((v) => v.startsWith('discord'))[0]
				.split(':')[1];
			const idSteam = user.identifiers.filter((v) => v.startsWith('steam'))[0];
			const nameg = user.name;
			return { idDiscord, idSteam, nameg };
		});
		for (const x in data_db) {
			const user = data_db[x];
			const check = data_user.find((v) => v.idDiscord === user.idDiscord);
			// If user name start with string equal name start CA , S.W.A.T , QLCA , PGĐCA , GĐCA
			const time = await time_mean.findOne({ idRole: user.idRole });
			if (time !== null) {
				let timerate = time.timerate.split('-');
				let start = Number(timerate[0]);
				let end = Number(timerate[1]);
				if (new Date().getHours() >= start && new Date().getHours() <= end) {
					if (check === undefined) {
						if (user.status) {
							await rOnline.updateOne(
								{ idDiscord: user.idDiscord },
								{
									status: false,
									timeOnline:
										user.timejoin > 0
											? Math.floor(
													new Date().getTime() / 1000.0 - user.timejoin,
											  ) + user.timeOnline
											: user.timeOnline,
									timejoin: 0,
									timeleave: Math.floor(new Date().getTime() / 1000.0),
								},
							);
						}
					} else {
						if (
							check.nameg.startsWith('CA') ||
							check.nameg.startsWith('S.W.A.T') ||
							check.nameg.startsWith('QLCA') ||
							check.nameg.startsWith('PGĐCA') ||
							check.nameg.startsWith('GĐCA') ||
							check.nameg.startsWith('Quân Y') ||
							check.nameg.startsWith('MED')
						) {
							if (!user.status) {
								await rOnline.updateOne(
									{ idDiscord: user.idDiscord },
									{
										status: true,
										timejoin: Math.floor(new Date().getTime() / 1000.0),
										timeleave: 0,
										nameg: check.nameg,
										idSteam: check.idSteam,
									},
								);
							}
						}
					}
				} else {
					if (check !== undefined) {
						if (user.status) {
							await rOnline.updateOne(
								{ idDiscord: user.idDiscord },
								{
									status: false,
									timeOnline:
										user.timejoin > 0
											? Math.floor(
													new Date().getTime() / 1000.0 - user.timejoin,
											  ) + user.timeOnline
											: user.timeOnline,
									timejoin: 0,
									timeleave: Math.floor(new Date().getTime() / 1000.0),
								},
							);
						}
					}
				}
			}
		}
	};

	// Interval to update data

	if (client.isReady) {
		setInterval(async () => {
			await update();
		}, 5000);
		client.on('messageCreate', async (message) => {
			const content = message.content;
			if (content === ',casang') {
				const roleid = '1124964394019864586';
				// get data in database with role id
				const data = await rOnline.find({ idRole: roleid });
				// Loop to get data
				let arr = [];
				data.forEach(async (user) => {
					arr.push({
						idDiscord: user.idDiscord,
						timeOnline: user.timeOnline,
						timejoin: user.timejoin,
						timeleave: user.timeleave,
						status: user.status,
						nameg: user.nameg,
						idSteam: user.idSteam,
					});
				});
				// Sort data
				arr.sort((a, b) => b.timeOnline - a.timeOnline);
				// Make emded to send message and auto create page if data > 24 user
				let page = 1;
				let maxPage = Math.ceil(arr.length / 24);
				let arrPage = [];
				for (let i = 0; i < arr.length; i++) {
					if (i % 24 === 0) {
						arrPage.push(arr.slice(i, i + 24));
					}
				}
				let arrEmbed = [];
				for (let i = 0; i < arrPage.length; i++) {
					let embed = new MessageEmbed()
						.setTitle('CA SÁNG')
						.setDescription(`**CA SÁNG**\n\n`)
						.setColor('BLUE')
						.setTimestamp();
					arrPage[i].forEach((user, index) => {
						embed.addFields({
							name: `${index + 1}. ${user.nameg}`,
							value: `**Thời gian online: ${user.timeOnline}**\n**Discord: <@${
								user.idDiscord
							}>**\n**ID Steam: ${user.idSteam}**\n**Status: ${
								user.status ? '🟢' : '🔴'
							}**`,
							inline: true,
						});
					});
					arrEmbed.push(embed);
				}
				const row = new MessageActionRow().addComponents(
					new MessageButton()
						.setCustomId('back')
						.setLabel('Back')
						.setStyle('PRIMARY'),
					new MessageButton()
						.setCustomId('next')
						.setLabel('Next')
						.setStyle('PRIMARY'),
					new MessageButton()
						.setCustomId('close')
						.setLabel('Close')
						.setStyle('DANGER'),
				);
				const msg = await message.channel.send({
					embeds: [arrEmbed[page - 1]],
					components: [row],
				});
				const filter = (i) => i.user.id === message.author.id;
				const collector = msg.createMessageComponentCollector({
					filter,
					time: 60000,
				});
				collector.on('collect', async (i) => {
					if (i.customId === 'back') {
						if (page <= 1) return;
						page--;
						await i.update({
							embeds: [arrEmbed[page - 1]],
							components: [row],
						});
					} else if (i.customId === 'next') {
						if (page >= maxPage) return;
						page++;
						await i.update({
							embeds: [arrEmbed[page - 1]],
							components: [row],
						});
					} else if (i.customId === 'close') {
						await i.update({
							embeds: [arrEmbed[page - 1]],
							components: [],
						});
					}
				});
			}
		});
		client.on('guildMemberUpdate', async (oldMember, newMember) => {
			// Update new Role for user when user updated or deleted role in discord
			const guildId = newMember.guild.id;
			const guild = client.guilds.cache.get(guildId);
			const casang = guild.roles.cache.get('1124964394019864586'); // Change id role
			const catrua = guild.roles.cache.get('1124964394019864586'); // Change id role
			const catoi = guild.roles.cache.get('1124964394019864586'); // Change id role
			const cakhuya = guild.roles.cache.get('1124964394019864586'); // Change id role
			const member = guild.members.cache.get(newMember.id);
			if (
				member.roles.cache.has(casang.id) ||
				member.roles.cache.has(catrua.id) ||
				member.roles.cache.has(catoi.id) ||
				member.roles.cache.has(cakhuya.id)
			) {
				// Check user have role in database
				const data = await rOnline.findOne({ idDiscord: newMember.id });
				if (data === null) {
					// If user have role in database
					await rOnline.create({
						idDiscord: newMember.id,
						idRole: member.roles.cache.has(casang.id)
							? casang.id
							: member.roles.cache.has(catrua.id)
							? catrua.id
							: member.roles.cache.has(catoi.id)
							? catoi.id
							: cakhuya.id,
						timeOnline: 0,
						timejoin: 0,
						timeleave: 0,
						status: false,
						nameg: '',
						idSteam: '',
					});
				} else {
					await rOnline.findOneAndUpdate(
						{ idDiscord: newMember.id },
						{
							idRole: member.roles.cache.has(casang.id)
								? casang.id
								: member.roles.cache.has(catrua.id)
								? catrua.id
								: member.roles.cache.has(catoi.id)
								? catoi.id
								: cakhuya.id,
						},
						{ new: true, upsert: true },
					);
				}
			} else {
				await rOnline.findOneAndDelete({ idDiscord: newMember.id });
			}
		});
	}
};
