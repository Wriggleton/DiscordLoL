const axios = require("axios").default;

const baseUrl = "https://euw1.api.riotgames.com";

const getSummonerLevel = async (name) => {
    try {
      const response = await axios.get(
          baseUrl + "/lol/summoner/v4/summoners/by-name/" + name,
          {
              headers: {
                "X-Riot-Token": process.env.LOL_TOKEN
              }
          });
      return response.data.summonerLevel;
    } catch (error) {
      console.error(error);
      return `Cannot find summoner level for ${name}.`;
    }
}

module.exports = {
    getSummonerLevel
}