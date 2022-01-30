const { call } = require ("../services/lolClient");

async function latestMatch(lolData, args) {
    if (!Array.isArray(args) || args.length === 0) return [false, "Invalid arguments."];
    const name = args[0];
    const player = lolData.players.find(p => p.name.toLowerCase() === name.toLowerCase());
    if (!player) {
        return [false, `Summoner ${name} not registered, use !register first!`];
    }

    try {
        const [success, data] = await call(`/lol/match/v5/matches/by-puuid/${player.puuid}/ids`, { params: { count: 1 }});
        if (!success) {
            return [false, "API call failed."];
        }

        if (data.length === 0) {
            return [false, `No latest match found for ${name}.`];
        }

        const matchId = data[0];
        const [success2, data2] = await call(`/lol/match/v5/matches/${matchId}`);
        if (!success2) {
            return [false, "API call failed."];
        }

        const info = data2.info;
        const relevantParticipant = info.participants.find(p => p.puuid === player.puuid);

        return [true, `Last game started at ${new Date(info.gameCreation).toLocaleString("nl-NL")} and lasted ${info.gameDuration / 60} minutes. You played the ${relevantParticipant.individualPosition} position.`];
    } catch (error) {
        console.log(error);
        return [false, "An error occurred trying to get latest match information, no matches played?"];
    }
}

module.exports = {
    commandName: "latestmatch",
    action: latestMatch
};