const axios = require("axios").default;

const baseUrl = "https://euw1.api.riotgames.com";
const data = {
    players: []
};

const getSummonerLevel = async (name) => {
    try {
      const response = await axios.get(
          baseUrl + "/lol/summoner/v4/summoners/by-name/" + name,
          {
              headers: {
                "X-Riot-Token": process.env.LOL_TOKEN
              }
          });
    
      const puuid = response.data.puuid;
      if (!data.players.find(player => player.puuid === puuid)) {
        data.players.push({
            puuid: puuid,
            name: response.data.name
        });
      }

      console.log(data);
      return [true, response.data.summonerLevel];
    } catch (error) {
      console.error(error);
      return [false, -1];
    }
}

module.exports = {
    getSummonerLevel
}