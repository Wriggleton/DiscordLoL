const { call } = require("./client");

async function getLatestMatchId(puuid) {
    try {
        const [success, data] = await call(`/lol/match/v5/matches/by-puuid/${puuid}/ids`, { params: { count: 1 } });
        if (!success) {
            return [false, null];
        }

        if (data.length === 0) {
            return [false, null];
        }

        return [true, data[0]];
    } catch (error) {
        console.log(error);
        return [false, null];
    }
}

async function getLatestMatchDetails(matchId) {
    try {
        const [success, data] = await call(`/lol/match/v5/matches/${matchId}`);
        if (!success) {
            return [false, null];
        }

        return [true, data];
    }
    catch (error) {
        console.log(error);
        return [false, null];
    }
}

module.exports = {
    getLatestMatchDetails,
    getLatestMatchId
};