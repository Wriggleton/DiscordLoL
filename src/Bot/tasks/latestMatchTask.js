const { getLatestMatchId, getLatestMatchDetails } = require("../services/lol/matchService");

const reportedMatchesForPlayers = [];

async function getLatestMatches(client, lolData) {
    const players = lolData.players;
    const matchesToReport = [];

    for (const player of players) {
        const [success, matchId] = await getLatestMatchId(player.puuid);
        if (!success) {
            return;
        }

        let match = lolData.matches.find(match => match.metadata.matchId === matchId);
        if (!match) {
            const [matchFound, newMatch] = await getLatestMatchDetails(matchId);
            if (!matchFound) {
                return;
            }

            match = newMatch;
            console.log(`Found new match for ${player.name}.`);
            lolData.matches.push(newMatch);
        }

        if (!reportedMatchesForPlayers.find(r => r.matchId === matchId && r.puuid === player.puuid)
            && !matchesToReport.find(m => m === matchId)) {
            matchesToReport.push(matchId);
        }
    }

    matchesToReport.forEach(matchToReport => {
        const match = lolData.matches.find(m => m.metadata.matchId === matchToReport);
        const info = match.info;
        const players = [];
        const channels = [];
        info.participants.forEach(participant => {
            const existingPlayer = lolData.players.find(player => player.puuid === participant.puuid);
            if (existingPlayer) {
                if (!channels.find(c => c === existingPlayer.channelId)) {
                    channels.push(existingPlayer.channelId);
                }

                players.push(existingPlayer.name);
                reportedMatchesForPlayers.push({
                    matchId: matchToReport,
                    puuid: existingPlayer.puuid
                });
            }
        });

        const allPlayers = players.join(", ");
        channels.forEach(channel => {
            client.channels.cache.get(channel).send(`[${allPlayers}] Last game started at ${new Date(info.gameCreation).toLocaleString("nl-NL")} and lasted ${info.gameDuration / 60} minutes.`);
        })
    })
}

module.exports = {
    getLatestMatchesTask: getLatestMatches
}