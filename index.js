require('dotenv').config();
const Discord = require("discord.js");
const {Client, Collection, Events, GatewayIntentBits } = require('discord.js');
const { abort } = require('process');
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



// client.on('messageCreate', async (message) => {
//     if (message.author.bot) return;
//     if (message.content.toLowerCase().startsWith('message reaction test')) {
//         const reactionEmoji = client.emojis.cache.get('589154027145789441');
//         message.react(reactionEmoji).catch(err => {
//             message.reply("Emoji React Error!");
//             console.error("Error, failed to react", err);
//         });
//     } else if (message.content.toLowerCase().startsWith("!react")) {
//         const args = message.content.split(' ').slice(1);
//         if (args.length !== 1){
//             return message.reply("Please provide a valid emoji!");
//         }
//         const emoji = args[0];
//         if (!emoji) {
//             return message.reply("Please provide an emoji for me to react with!");
//         }
//         const emojiRegex = /<a?:\w+:(\d+)>|([\p{Emoji}\u200D\uFE0F]+)/gu;
//         const emojis = emoji.match(emojiRegex);
//         if (!emojis || emojis.length!== 1 || !isValidEmoji(emojis[0])){
//             return message.reply("Please provide a valid emoji!")
//         }

//         message.reply({ content: 'I will react to my own message!' }).then(sentMessage => {
//             sentMessage.react(emojis[0]).catch(err => {
//                 message.reply("Invalid emoji!");
//                 console.error("Error, failed to react", err);
//             });
//         }).catch(err => {
//             message.reply("Failed to send message! Someone tell Con there is a problem with my code.");
//             console.error("Failed to send message", err);
//         });
//     }
// });
// const isValidEmoji = (input) => {
//     const customEmojiMatch = input.match(/<a?:\w+:(\d+)>/);
//     if (customEmojiMatch) {
//         const customEmojiId = customEmojiMatch[1];
//         return client.emojis.cache.has(customEmojiId);
//     }
//     return /\p{Emoji}/u.test(input);
// };

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
