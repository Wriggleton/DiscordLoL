const { call } = require ("../services/lolClient");

async function registerSummoner(lolData, args) {
    if (!Array.isArray(args) || args.length === 0) return [false, "Invalid arguments."];
    const name = args[0];
    try {
        const [success, data] = await call(`/lol/summoner/v4/summoners/by-name/${name}`, { useSpecific: true });
        if (!success) {
            return [false, "API call failed."];
        }

        const puuid = data.puuid;
        if (lolData.players.find(player => player.puuid === puuid)) {
            return [true, `Already registered Summoner ${name}.`];
        }

        lolData.players.push({
            puuid: puuid,
            name: data.name
        });
        return [true, `Successfully registered Summoner ${name}.`];
    } catch (error) {
        return [false, `An error occurred trying to register Summoner ${name}, he/she probably does not exist.`];
    }
}

module.exports = {
    commandName: "register",
    action: registerSummoner
};