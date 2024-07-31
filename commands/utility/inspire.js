const {SlashCommandBuilder} = require('discord.js');
const axios = require('axios');
module.exports = {
    data: new SlashCommandBuilder()
    .setName('inspire')
    .setDescription('Get an inspirational quote from InspiroBot!'),
async execute (interaction) {
    try{
        const response = await axios.get('https://inspirobot.me/api?generate=true')
        const imageURL = response.data
        await interaction.reply({content: imageURL});
    } catch (error) {
        console.error ("Error fetching InspiroBot image", error);
        await interaction.reply({content: 'Failed to fetch image! Someone tell Con there is a problem with my code.'});
    }
},
};
