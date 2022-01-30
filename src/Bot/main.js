require('dotenv').config()
const { Client, Intents } = require("discord.js");
const { manager } = require("./services/lolManager");
const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] })

client.on("ready", () => {
    console.log(`Logged in as ${client.user.tag}!`)
})

const commandPrefix = "!";
client.on("messageCreate", async msg => {
    if (msg.author.bot) return;
    if (!msg.content.startsWith(commandPrefix)) return;

    const commandBody = msg.content.slice(commandPrefix.length);
    const args = commandBody.split(' ');
    const command = args.shift().toLowerCase();

    const [success, replyMessage] = await manager.execute(command, args);
    msg.reply(replyMessage);
})

client.login(process.env.DISCORD_TOKEN)