const registerCommand = require("../commands/registerCommand");

const lolData = {
    players: []
};

const commandList = [];
commandList.push(registerCommand);

const manager = {
    execute: async (commandName, arguments) => {
        const command = commandList.find(cmd => cmd.commandName === commandName);
        if (command) {
            const result = await command.action(lolData, arguments);
            console.log(lolData);
            return result;
        }

        return [false, `Command ${commandName} not found.`];
    }
};

module.exports = {
    manager
};