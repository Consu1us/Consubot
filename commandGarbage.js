require('dotenv').config();
const { REST, Routes } = require('discord.js');
const { clientId, token } = require('./config.json');

const rest = new REST({ version: '10' }).setToken(token);

(async () => {
    try {
        console.log('Started deleting old application (/) commands.');

        // // For global commands
        // const globalCommands = await rest.get(Routes.applicationCommands(clientId));
        // for (const command of globalCommands) {
        //     await rest.delete(Routes.applicationCommand(clientId, command.id));
        // }

        // console.log('Successfully deleted old global application (/) commands.');

        // Optionally delete commands from a specific guild
        const guildId = '458711595858788372'; // Replace with your guild ID
        const guildCommands = await rest.get(Routes.applicationGuildCommands(clientId, guildId));
        for (const command of guildCommands) {
            await rest.delete(Routes.applicationGuildCommand(clientId, guildId, command.id));
        }

        console.log('Successfully deleted old guild application (/) commands.');
    } catch (error) {
        console.error(error);
    }
})();