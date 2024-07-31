const {SlashCommandBuilder} = require('discord.js')
module.exports = {
    data: new SlashCommandBuilder()
    .setName('customreact')
    .setDescription('Bot reacts to a message of your choice with an emoji of your choice!')
    .addStringOption(option =>
        option.setName('emoji')
            .setDescription('Emoji that the bot reacts with!')
            .setRequired(true)
    )
    .addStringOption(option => 
        option.setName('message_id')
            .setDescription('Message that the bot will react to!')
            .setRequired(true)
    )
    .addStringOption(option =>
        option.setName('channel_id')
        .setDescription('(Optional) Channel for the bot to look in!')
        .setRequired(false)
    ),
async execute (interaction) {
    const emoji = interaction.options.getString('emoji');
    const messageID = interaction.options.getString('message_id');
    const channelID = interaction.options.getString('channel_id');
    try {
        let channel = interaction.channel

        if (channelID){
            channel = await interaction.client.channels.fetch(channelID);
            if (!channel.isTextBased()){
                throw new Error('Provided channel ID is not text-based!')
                }}
        const message = await channel.messages.fetch(messageID);
        await message.react(emoji);
        await interaction.reply({ content: 'Reacted to the message successfully!', ephemeral: true });
        } catch (error) {
            console.error('Failed to react to message!', error)
            await interaction.reply({content: 'Could not react to message! Please make sure emoji, message and/or channel ID are valid!', ephemeral: true});
    }
}
};