const {SlashCommandBuilder} = require('discord.js');
module.exports = {
    data: new SlashCommandBuilder()
    .setName('dm')
    .setDescription('DM a user of your choice a message of your choice (Requires owner permission)')
    .addStringOption (option => 
        option.setName('message')
            .setDescription('Message that will be sent!')
            .setRequired(true))
    .addUserOption(option => 
        option.setName('target')
            .setDescription('User that will be messaged!')
            .setRequired(true)),
    async execute(interaction) {
        const user = interaction.options.getUser('target');
        const message = interaction.options.getString('message');

    if (interaction.user.id == '412367471245393923'){
        try {
        await user.send(message);
        await interaction.reply({content: 'DM sent successfully!', ephemeral: true})
    } catch (error) {
        console.error('Error sending DM ', error);
        await interaction.reply({content: 'An error occurred sending the DM!', ephemeral: true})
    }} else{
        await interaction.reply({content: 'You do not have permission to execute this command!', ephemeral: true})
        console.log('Someone attempted to execute dm command but did not have Owner: ', interaction.user.tag )
    }
}
}