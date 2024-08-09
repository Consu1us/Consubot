const { SlashCommandBuilder } = require('discord.js');
module.exports = {
    data: new SlashCommandBuilder()
        .setName('ping')
        .setDescription('Pings the bot'),
    async execute(interaction) {
        const sent = await interaction.reply({ content: 'Ping...', fetchReply: true });
        await interaction.editReply(`Pong! \`${Date.now() - sent.createdTimestamp}ms\``);
    }
};



// Message listener command for reference
// client.on('messageCreate', async (message) => {
//     if (message.author.bot) return;
//     if (message.content === '!ping' && message.channel.id !== "816530107518156830") {
//         message.channel.send("Ping...").then((msg)=> {msg.edit("Pong! `"+(Date.now()-msg.createdTimestamp)+"ms`")});
//     }
// })