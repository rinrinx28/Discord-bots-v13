const { Client } = require('discord.js');
const fetch = require('node-fetch');
const URL_API = process.env.URL_API;
/**
 *
 * @param {Client} client
 */
module.exports = async (client) => {
	const getData = (url) => {
		return fetch(url)
			.then((res) => res.json())
			.catch((e) => {
				throw new Error('Api Error', e);
			});
	};

	/**
	 *
	 * @param {Array} dataApi Data From Server
	 * @returns Member data
	 */
	const findData = async (dataApi) => {};

	const start = () => {
		find();
	};
};
