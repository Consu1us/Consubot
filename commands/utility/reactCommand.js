const {SlashCommandBuilder} = require('discord.js')
module.exports = {
    data: new SlashCommandBuilder()
    .setName('react')
    .setDescription('Bot reacts to command with reaction of your choice')
    .addStringOption(option =>
        option.setName('emoji')
            .setDescription('Emoji that the bot reacts with!')
            .setRequired(true)
    ),
async execute (interaction) {
    const emoji = interaction.options.getString('emoji');
    const sentMessage = await interaction.reply({content: 'I will react to this message!', fetchReply: true});
    try {
        await sentMessage.react(emoji);
    } catch (error) {
        console.error('Failed to react with emoji', error);
        await interaction.editReply({content: 'Failed to react. Please ensure it is a valid emoji!', ephemeral: true});
    }
}
}