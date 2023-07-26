const {
	AudioPlayer,
	createAudioResource,
	StreamType,
	entersState,
	VoiceConnectionStatus,
	joinVoiceChannel,
} = require('@discordjs/voice');
const { Client } = require('discord.js');
const discordTTS = require('discord-tts');
const TTS_C = new Map();
let voiceConnection;
let audioPlayer = new AudioPlayer();
/**
 *
 * @param {Client} client
 */

module.exports = async (client) => {
	let timeoutID = null;
	const timeoutDuration = 30000; // Timeout duration in milliseconds (30 seconds)
	client.on('messageCreate', async (msg) => {
		if (msg.content.startsWith('!tts')) {
			const voiceChannel = msg.member.voice.channel;
			const text = msg.content.slice(4); // Extract text after the command
			if (!voiceChannel) return msg.reply('Bạn cần vào voice channel trước !');
			if (text.length < 4) return msg.reply('Bạn cần nhập nội dung cần nói !');
			if (
				TTS_C.get('start') &&
				TTS_C.get('start').channel.id !== voiceChannel.id
			)
				return msg.reply(
					'Bot TTS đang phát ở một kênh khác, xin vui lòng chờ đợi !',
				);
			const stream = discordTTS.getVoiceStream(text, { lang: 'vi' });
			const audioResource = createAudioResource(stream, {
				inputType: StreamType.Arbitrary,
				inlineVolume: true,
			});
			if (
				!voiceConnection ||
				voiceConnection?.status === VoiceConnectionStatus.Disconnected
			) {
				voiceConnection = joinVoiceChannel({
					channelId: msg.member.voice.channelId,
					guildId: msg.guildId,
					adapterCreator: msg.guild.voiceAdapterCreator,
				});
				voiceConnection = await entersState(
					voiceConnection,
					VoiceConnectionStatus.Connecting,
					5_000,
				);
			}

			if (voiceConnection.status === VoiceConnectionStatus.Connected) {
				voiceConnection.subscribe(audioPlayer);
				await audioPlayer.play(audioResource);
				if (!TTS_C.get('start')) {
					TTS_C.set('start', {
						connect: voiceConnection,
						channel: voiceChannel,
					});
				}
				if (timeoutID) {
					clearTimeout(timeoutID);
				}
				timeoutID = setTimeout(() => {
					voiceConnection.disconnect();
					TTS_C.delete('start');
					timeoutID = null; // Reset the timeoutID after it expires
				}, timeoutDuration);
			}
		}
	});
};
