// SlashCommandBuilder という部品を discord.js からインポートしています。
// これにより、スラッシュコマンドを簡単に構築できます。
const { SlashCommandBuilder } = require('discord.js');

// 以下の形式にすることで、他のファイルでインポートして使用できるようになります。
module.exports = {
	data: new SlashCommandBuilder()
		.setName('minemanage')
		.setDescription('Minecraft Serverの状態を変更したり確認したりします')
		.addStringOption(option =>
			option.setName('action')
				.setDescription('start/stop or status')
				.setRequired(true)
				.addChoices(
					{ name: 'start', value: 'start' },
					{ name: 'stop', value: 'stop' },
					{ name: 'status', value: 'status' },
				))
};
