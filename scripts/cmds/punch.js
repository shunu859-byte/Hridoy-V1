const fs = require("fs-extra");
const path = require("path");
const axios = require("axios");

module.exports = {
  config: {
    name: "punch",
    version: "1.0.1",
    hasPermssion: 0,
    credits: "Hridoy",
    description: "Punch a tagged friend",
    category: "Tag Fun",
    usages: "@tag",
    cooldowns: 5
  },

  onStart: async function({ api, event }) {
    try {
      // Check mentions
      if (!event.mentions || Object.keys(event.mentions).length === 0)
        return api.sendMessage("❌ Please tag someone to punch!", event.threadID, event.messageID);

      const mentionID = Object.keys(event.mentions)[0];
      const tagName = event.mentions[mentionID].replace("@", "");

      // Punch GIF links
      const gifs = [
        "https://i.postimg.cc/SNX8pD8Z/13126.gif",
        "https://i.postimg.cc/TYZb2gJT/1467506881-1016b5fd386cf30488508cf6f0a2bee5.gif",
        "https://i.postimg.cc/fyV3DR33/anime-punch.gif",
        "https://i.postimg.cc/P5sLnhdx/onehit-30-5-2016-3.gif"
      ];

      const randomGif = gifs[Math.floor(Math.random() * gifs.length)];

      // Cache folder
      const cacheDir = path.join(__dirname, "cache");
      if (!fs.existsSync(cacheDir)) fs.mkdirSync(cacheDir, { recursive: true });

      const gifPath = path.join(cacheDir, "punch.gif");

      // Download GIF
      const response = await axios({ url: randomGif, method: "GET", responseType: "stream" });
      const writer = fs.createWriteStream(gifPath);
      response.data.pipe(writer);

      writer.on("finish", () => {
        api.sendMessage(
          {
            body: `👊 ${tagName} got punched by you!`,
            mentions: [{ tag: tagName, id: mentionID }],
            attachment: fs.createReadStream(gifPath)
          },
          event.threadID,
          () => fs.existsSync(gifPath) && fs.unlinkSync(gifPath),
          event.messageID
        );
      });

      writer.on("error", () => {
        api.sendMessage("❌ Failed to download punch GIF.", event.threadID, event.messageID);
      });

    } catch (err) {
      console.error(err);
      api.sendMessage("❌ An unexpected error occurred.", event.threadID, event.messageID);
    }
  }
};