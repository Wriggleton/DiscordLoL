const registerCommand = require("../../commands/registerCommand");

const lolData = {
    players: [],
    matches: []
};

const commandList = [];
commandList.push(registerCommand);

const commandPrefix = "!";
const manager = {
    execute: async (msg) => {
        if (!msg.content.startsWith(commandPrefix)) return [false, null];

        const commandBody = msg.content.slice(commandPrefix.length);
        const args = commandBody.split(' ');
        const commandName = args.shift().toLowerCase();

        const command = commandList.find(cmd => cmd.commandName === commandName);
        if (command) {
            const result = await command.action(lolData, args, msg);
            return result;
        }

        return [false, `Command ${commandName} not found.`];
    }
};

module.exports = {
    manager,
    lolData
};