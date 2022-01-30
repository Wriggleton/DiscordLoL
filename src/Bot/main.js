require('dotenv').config()
const { Client, Intents } = require("discord.js");
const { getSummonerLevel } = require("./Service/lol");
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

  if (command === "summonerlevel") {
      const summonerName = args[0];
      const [success, level] = await getSummonerLevel(summonerName);
      if (success) {
        msg.reply(`Current summoner level for ${summonerName} is ${level}!`); 
      }
      else {
        msg.reply(`No such summoner: ${summonerName}!`);
      }            
  } 
})

client.login(process.env.DISCORD_TOKEN)