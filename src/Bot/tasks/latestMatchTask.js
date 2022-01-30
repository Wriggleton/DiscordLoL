const { getLatestMatchId, getLatestMatchDetails } = require("../services/lol/matchService");
const { MessageEmbed } = require("discord.js");
const { properRole } = require("../helpers/lol/naming");
const { getRelevantRoleStats } = require("../helpers/lol/roleStats");

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

                players.push(participant);
                reportedMatchesForPlayers.push({
                    matchId: matchToReport,
                    puuid: existingPlayer.puuid
                });
            }
        });

        channels.forEach(channel => {
            const minutes = Math.floor(info.gameDuration / 60);
            const seconds = info.gameDuration % 60;

            let embed = new MessageEmbed()
            .setTitle(`Last game played at ${new Date(info.gameCreation).toLocaleString("nl-NL")}`)
            .addField("Duration", `${minutes} minutes and ${seconds} second(s)`)
            .setThumbnail(`https://ddragon.leagueoflegends.com/cdn/12.2.1/img/map/map${info.mapId}.png`);

            for (const player of players) {
                embed = embed.addField(
                    `${player.summonerName} (${properRole(player.individualPosition)})`, 
                    `${player.championName} - level ${player.champLevel}
                    ${player.kills} kill(s), ${player.deaths} death(s), ${player.assists} assist(s)
                    ${getRelevantRoleStats(player)}
                    ${player.win ? "Won" : "Lost"} the game ${player.win ? "🥳" : "😭"}`);
            }

            let randomChampion = players[0];
            if (players.length > 1) {
                const rand = Math.floor(Math.random() * (players.length - 1 + 1));
                randomChampion = players[rand];
            }

            embed = embed
                .setImage(`https://ddragon.leagueoflegends.com/cdn/img/champion/splash/${randomChampion.championName}_0.jpg`)
                .addField("\u200b", "\u200b")
                .addField("MVP", `${randomChampion.summonerName} as ${randomChampion.championName}`);
            client.channels.cache.get(channel).send({ embeds: [embed] });
            //client.channels.cache.get(channel).send(`[${allPlayers}] Last game started at ${new Date(info.gameCreation).toLocaleString("nl-NL")} and lasted ${minutes} minutes and ${seconds} second(s).`);
        })
    })
}

module.exports = {
    getLatestMatchesTask: getLatestMatches
}