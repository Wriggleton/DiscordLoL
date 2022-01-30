require('dotenv').config()
const { Client, Intents } = require("discord.js");
const { manager, lolData } = require("./services/lol/manager");
const { getLatestMatchesTask } = require("./tasks/latestMatchTask");
const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] })

client.on("ready", () => {
    console.log(`Logged in as ${client.user.tag}!`)
})

client.on("messageCreate", async msg => {
    if (msg.author.bot) return;

    const [success, replyMessage] = await manager.execute(msg);
    if (replyMessage) {
        msg.reply(replyMessage);
    }
})

client.login(process.env.DISCORD_TOKEN)

setInterval(async () => {
    console.log("Running tasks...");
    await getLatestMatchesTask(client, lolData);
}, 10 * 1000)