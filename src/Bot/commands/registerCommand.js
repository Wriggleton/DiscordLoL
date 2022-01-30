const { call } = require ("../services/lol/client");

async function registerSummoner(lolData, args, msg) {
    if (!Array.isArray(args) || args.length === 0) return [false, "Invalid arguments."];
    const name = args[0];
    const [success, data] = await call(`/lol/summoner/v4/summoners/by-name/${name}`, { useSpecific: true });
    if (!success) {
        return [false, `Couldn't find a summoner with name \"${name}\".`];
    }

    const puuid = data.puuid;
    if (lolData.players.find(player => player.puuid === puuid)) {
        return [true, `Already registered Summoner ${name}.`];
    }

    lolData.players.push({
        puuid: puuid,
        name: data.name,
        channelId: msg.channelId
    });

    const embed = {
        title: data.name,
        description: `Summoner level ${data.summonerLevel}`,
        thumbnail: {
            url: `http://ddragon.leagueoflegends.com/cdn/12.2.1/img/profileicon/${data.profileIconId}.png`
        },
    };

    return [true, `Successfully registered ${data.name}.`, embed];
}

module.exports = {
    commandName: "register",
    action: registerSummoner
};