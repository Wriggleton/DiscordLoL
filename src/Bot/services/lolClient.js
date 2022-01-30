const axios = require("axios").default;

const baseSpecificEUWUrl = "https://euw1.api.riotgames.com";
const baseEuropeUrl = "https://europe.api.riotgames.com";
const call = async (url, options = { params: null, useSpecific: false }) => {
  try {
    const response = await axios.get(
      (options.useSpecific ? baseSpecificEUWUrl : baseEuropeUrl) + url,
      {
        params: options.params,
        headers: {
          "X-Riot-Token": process.env.LOL_TOKEN
        }
      });

    return [true, response.data];
  } catch (error) {
    return [false, null];
  }
};

module.exports = {
  call
}