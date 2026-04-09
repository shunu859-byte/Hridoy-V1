const fs = require("fs-extra");
const path = require("path");
const axios = require("axios");

module.exports = {
  config: {
    name: "kick",
    version: "1.0.2",
    hasPermssion: 0,
    credits: "Hridoy",
    description: "Kick the tagged friend",
    category: "Tag Fun",
    usages: "@tag",
    cooldowns: 5
  },

  onStart: async function({ api, event }) {
    try {
      // Check mentions
      if (!event.mentions || Object.keys(event.mentions).length === 0)
        return api.sendMessage("❌ Please tag someone to kick!", event.threadID, event.messageID);

      const mentionID = Object.keys(event.mentions)[0];
      const tagName = event.mentions[mentionID].replace("@", "");

      // Kick GIF links (fixed commas)
      const gifs = [
        "https://i.imgur.com/0kL1jqP.gif",
        "https://i.imgur.com/HPzBl6x.gif",
        "https://i.postimg.cc/65TSxJYD/2ce5a017f6556ff103bce87b273b89b7.gif",
        "https://i.postimg.cc/65SP9jPT/Anime-083428-6224795.gif",
        "https://i.postimg.cc/RFXP2XfS/jXOwoHx.gif",
        "https://i.postimg.cc/jSPMRsNk/tumblr-nyc5ygy2a-Z1uz35lto1-540.gif"
      ];

      const randomGif = gifs[Math.floor(Math.random() * gifs.length)];

      // Cache folder
      const cacheDir = path.join(__dirname, "cache");
      if (!fs.existsSync(cacheDir)) fs.mkdirSync(cacheDir, { recursive: true });

      const gifPath = path.join(cacheDir, `kick_${Date.now()}.gif`);

      // Download GIF
      const response = await axios({ url: randomGif, method: "GET", responseType: "stream" });
      const writer = fs.createWriteStream(gifPath);
      response.data.pipe(writer);

      writer.on("finish", () => {
        api.sendMessage(
          {
            body: `🦵 ${tagName}, you just got kicked! 😆`,
            mentions: [{ tag: tagName, id: mentionID }],
            attachment: fs.createReadStream(gifPath)
          },
          event.threadID,
          () => fs.existsSync(gifPath) && fs.unlinkSync(gifPath),
          event.messageID
        );
      });

      writer.on("error", () => {
        api.sendMessage("❌ Failed to download kick GIF.", event.threadID, event.messageID);
      });

    } catch (err) {
      console.error("Kick Command Error:", err);
      api.sendMessage("❌ An unexpected error occurred.", event.threadID, event.messageID);
    }
  }
};
