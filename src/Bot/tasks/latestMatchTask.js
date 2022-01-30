const { getLatestMatchId, getLatestMatchDetails } = require("../services/lol/matchService");
const { MessageEmbed } = require("discord.js");
const { properRole } = require("../helpers/lol/naming");

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
            .setThumbnail(`https://ddragon.leagueoflegends.com/cdn/12.2.1/img/map/map${info.mapId}.png`)
            .setImage("https://ddragon.leagueoflegends.com/cdn/12.2.1/img/champion/Nautilus.png");

            for (const player of players) {
                embed = embed.addField(
                    `${player.summonerName} (${properRole(player.individualPosition)})`, 
                    `${player.championName} - level ${player.champLevel}
                    ${player.kills} kill(s), ${player.deaths} death(s), ${player.assists} assist(s)
                    ${player.win ? "Won" : "Lost"} the game ${player.win ? "🥳" : "😭"}.`);
            }

            embed = embed.addField("\u200b", "\u200b").addField("MVP", "Nautilus");
            client.channels.cache.get(channel).send({ embeds: [embed] });
            //client.channels.cache.get(channel).send(`[${allPlayers}] Last game started at ${new Date(info.gameCreation).toLocaleString("nl-NL")} and lasted ${minutes} minutes and ${seconds} second(s).`);
        })
    })
}

module.exports = {
    getLatestMatchesTask: getLatestMatches
}