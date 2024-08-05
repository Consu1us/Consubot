/* eslint-disable no-undef */
require('dotenv').config();
const Discord = require("discord.js");
const {Collection, Events, ActivityType } = require('discord.js');
require('process');
const fs = require('node:fs');
const path = require('node:path');
const client = new Discord.Client({
    intents: [
    Discord.GatewayIntentBits.Guilds,
    Discord.GatewayIntentBits.GuildMessages,
    Discord.GatewayIntentBits.GuildMessageReactions,
    Discord.GatewayIntentBits.GuildMembers,
    Discord.GatewayIntentBits.MessageContent,    
    Discord.GatewayIntentBits.GuildPresences,
    Discord.GatewayIntentBits.DirectMessages,
],
    partials: [
        Discord.Partials.Channel,
        Discord.Partials.Message
    ]
});
const token = process.env.BOT_TOKEN;
client.login(token);
client.on('ready', async () => {
    console.log(`Client logged into: ${client.user.username}`);
    client.user.setPresence({ 
        activities: [{ name: 'I want to be free', type: ActivityType.Custom }], 
        status: 'online' 
    });
});


client.commands = new Collection();
const foldersPath = path.join(__dirname, 'commands');
const commandFolders = fs.readdirSync(foldersPath);
for (const folder of commandFolders){
    const commandsPath = path.join(foldersPath, folder);
    const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
    for (const file of commandFiles){
        const filePath = path.join(commandsPath, file);
        const command = require(filePath);
        if ('data' in command && 'execute' in command){
            client.commands.set(command.data.name, command);
        } else{
            console.log(`[WARNING] The command file at ${filePath} is missing required 'data' or 'execute' property.`)
        } }
}

client.on(Events.InteractionCreate, interaction => {
    if (!interaction.isChatInputCommand()) return;
    console.log(interaction);
});

client.on(Events.InteractionCreate, async interaction =>{
    if (!interaction.isChatInputCommand()) return;
    const command = interaction.client.commands.get(interaction.commandName);
    if (!command) {
        console.error(`No command matching ${interaction.commandName} found`);
        return;
    }
    try {
        await command.execute(interaction);
    } catch (error) {
        console.error(error);
        if (interaction.replied || interaction.deferred) {
            await interaction.followUp({content: 'Error executing command!', ephemeral: true});
        } else {
            await interaction.reply({content: 'Error executing command!', ephemeral: true})
        }
    }
})

client.on('messageCreate', async (message) => {
    const excludedRoleIds = ["801827572463173652", "589146768470704144",]; 
    if (!message.member) {
        console.error('Message member does not exist.'); // Fsr the bot deleting in suggestions outputs this error but still works fine so whatever!
        return;
    }
    if (!message.member.roles || !message.member.roles.cache) {
        console.error('Message member has no roles.');
        return;
    }
    if (message.channel.id === "816530107518156830" && message.content.toLowerCase().includes("suggestion:")) {
        try {
            await message.react('👍');
            await message.react('👎');
        } catch (err) {
            console.error('Failed to react!', err);
            await message.channel.send("Someone tell Con there is a problem with my code");
        }
    } else if (message.channel.id === "816530107518156830" && !message.content.toLowerCase().includes("suggestion:")) {
        const hasExcludedRole = excludedRoleIds.some(roleId => message.member.roles.cache.has(roleId));
        if (!hasExcludedRole) {
            try {
                await message.delete(); 
            } catch (err) {
                console.error('Failed to delete message!', err);
                await message.channel.send("Someone tell Con there is a problem with my code");
            }
        }
    }
});

client.on("messageCreate", async message => {
    if (message.guild) return;
    if (message.author.bot) return;
    console.log(`DM exchanged, ${message.content}`);
    if (!message.content) {
        console.log('DM received with non-URL image, returning. Author tag: ', message.author.tag );
        message.reply('Sorry, please resend your message with the URL instead of the uploaded image (Right click, copy URL, then send again)')
        return;
    }
    const embed = new Discord.EmbedBuilder()
        .setColor('#0923b5')
        .setAuthor({name: 'New DM', iconURL: message.author.displayAvatarURL()})
        .addFields(
            {name: 'User', value: `${message.author.tag} (${message.author.id})` },
            {name: 'Message', value: message.content}
        )
        .setFooter({text: 'Botsulus DM detection, contact Consu1us for assistance'})
        .setTimestamp();
    try {
        await client.channels.cache.get('1270019192158031902').send({embeds: [embed]});
        console.log('DM detector success!');
    } catch (error) {
        console.error('Error with DM detection', error)
    }
});
