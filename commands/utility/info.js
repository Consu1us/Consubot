const {SlashCommandBuilder} = require('discord.js');
const { setTimeout } = require('node:timers/promises');
let infoCooldown = false
console.log('infoCooldown is '+infoCooldown)
module.exports = {
    data: new SlashCommandBuilder()
    .setName('info')
    .setDescription('Information about the bot!'),
async execute (interaction) {
    if (!infoCooldown){
        infoCooldown=true
        console.log('infoCooldown is '+infoCooldown)
        await interaction.reply ({content: 'I am a simple bot designed to help Consulus learn programming.'});
        await setTimeout(2000);
        await interaction.channel.send ({content: 'Perhaps in the future I will have some very cool and complex features!'});
        await setTimeout(2000);
        await interaction.channel.send ({content: 'But for now I remain simple...'});
        await setTimeout(2000);
        await interaction.channel.send ({content: '😭'});
        await setTimeout(10000);
        infoCooldown = false
        console.log('infoCooldown is '+infoCooldown)
    } else {
        await interaction.reply({content: 'Please wait before using this command again!', ephemeral: true});
    }
}
}