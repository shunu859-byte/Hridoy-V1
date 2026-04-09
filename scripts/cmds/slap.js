const fs = require("fs-extra");
const path = require("path");
const axios = require("axios");

module.exports = {
  config: {
    name: "slap",
    version: "1.0.2",
    hasPermssion: 0,
    credits: "Hridoy",
    description: "Slap the friend you mention",
    category: "Tag Fun",
    usages: "@tag",
    cooldowns: 5
  },

  onStart: async function({ api, event }) {
    try {
      // Check mentions
      if (!event.mentions || Object.keys(event.mentions).length === 0) {
        return api.sendMessage("❌ Please tag someone to slap!", event.threadID, event.messageID);
      }

      const mentionID = Object.keys(event.mentions)[0];
      const tagName = event.mentions[mentionID].replace("@", "");

      // Slap GIF links
      const gifs = [
        "https://i.postimg.cc/Mc7rWvFv/12334wrwd534wrdf-1.gif",
        "https://i.postimg.cc/R3LGk2Wt/12334wrwd534wrdf-2.gif",
        "https://i.postimg.cc/CRj489H2/12334wrwd534wrdf-3.gif",
        "https://i.postimg.cc/MMr0xwqn/12334wrwd534wrdf-4.gif",
        "https://i.postimg.cc/KK2Jsm8F/12334wrwd534wrdf-5.gif",
        "https://i.postimg.cc/dZLBT14R/12334wrwd534wrdf-6.gif",
        "https://i.postimg.cc/Fd1cT63N/12334wrwd534wrdf-7.gif",
        "https://i.postimg.cc/rKRjVDdM/12334wrwd534wrdf-8.gif",
        "https://i.postimg.cc/G2fsCYtS/anime-slap.gif",
        "https://i.postimg.cc/C5fnL1fM/slap-anime.gif",
        "https://i.postimg.cc/ydxStn1Z/VW0cOyL.gif"
      ];

      const randomGif = gifs[Math.floor(Math.random() * gifs.length)];

      // Cache folder
      const cacheDir = path.join(__dirname, "cache");
      if (!fs.existsSync(cacheDir)) fs.mkdirSync(cacheDir, { recursive: true });

      const gifPath = path.join(cacheDir, "slap.gif");

      // Download GIF
      const response = await axios({ url: randomGif, method: "GET", responseType: "stream" });
      const writer = fs.createWriteStream(gifPath);
      response.data.pipe(writer);

      writer.on("finish", () => {
        api.sendMessage(
          {
            body: ` 👋Here's a slap for you, ${tagName}!\nNext time, behave yourself!`,
            mentions: [{ tag: tagName, id: mentionID }],
            attachment: fs.createReadStream(gifPath)
          },
          event.threadID,
          () => fs.existsSync(gifPath) && fs.unlinkSync(gifPath),
          event.messageID
        );
      });

      writer.on("error", () => {
        api.sendMessage("❌ Failed to download slap GIF.", event.threadID, event.messageID);
      });

    } catch (err) {
      console.error(err);
      api.sendMessage("❌ An unexpected error occurred.", event.threadID, event.messageID);
    }
  }
};