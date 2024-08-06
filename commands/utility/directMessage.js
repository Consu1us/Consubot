const {SlashCommandBuilder, EmbedBuilder} = require('discord.js');
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
    async execute(interaction, client) {
        const user = interaction.options.getUser('target');
        const message = interaction.options.getString('message');
        let dmSuccess = false


    if (interaction.user.id == '412367471245393923'){
        try {
        await user.send(message);
        await interaction.reply({content: 'DM sent successfully!', ephemeral: true});
        dmSuccess = true;
    } catch (error) {
        console.error('Error sending DM ', error);
        await interaction.reply({content: 'An error occurred sending the DM!', ephemeral: true})
    }} else{
        await interaction.reply({content: 'You do not have permission to execute this command!', ephemeral: true})
        console.log('Someone attempted to execute dm command but did not have Owner: ', interaction.user.tag )
    }

    if (dmSuccess) {
        const embed = new EmbedBuilder()
        .setColor('#03fcf8')
        .setAuthor({name: 'DM Sent!', iconURL: user.displayAvatarURL()})
        .addFields(
            {name: 'Sent to', value: `Name: ${user.displayName} | Tag: ${user.tag} | ID: (${user.id}) |` },
            {name: 'Content', value: message}
        )
        .setFooter({text: 'Botsulus DM detection, contact Consu1us for assistance'})
        .setTimestamp();
    try {
        const logChannel = client.channels.cache.get('1270019192158031902');
        if (logChannel) {
            await logChannel.send({embeds: [embed]});
            console.log('DM logged successfully! Sent to:', user.displayName,'| Message:', message);
        } else {
            console.error('Log channel not found!');
        }
    } catch (error) {
        console.error('Error with DM detection', error);
    }
    }
}
}