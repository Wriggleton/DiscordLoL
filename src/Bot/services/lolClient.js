const axios = require("axios").default;

const baseUrl = "https://euw1.api.riotgames.com";
const call = async (url) => {
  try {
    const response = await axios.get(
      baseUrl + url,
      {
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