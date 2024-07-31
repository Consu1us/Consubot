const {SlashCommandBuilder} = require('discord.js')
module.exports = {
    data: new SlashCommandBuilder()
    .setName('say')
    .setDescription('Bot says whatever message you want!')
    .addStringOption(option =>
        option.setName('message')
            .setDescription('Message that the bot will say!')
            .setRequired(true)
    ),
async execute (interaction) {
    const sayMessage = interaction.options.getString('message');
    try {
        await interaction.reply({content: sayMessage})
    } catch (error) {
        console.error('Failed to say message', error);
    }
}
}