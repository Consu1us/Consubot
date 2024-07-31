const {SlashCommandBuilder} = require('discord.js')
module.exports = {
    data: new SlashCommandBuilder()
    .setName('help')
    .setDescription('List of commands!'),
async execute (interaction) {
    await interaction.reply({content: "# List of commands: \n /react \n /ping \n /say \n /help \n /info \n /customreact \n /inspire", ephemeral:true})
}
}