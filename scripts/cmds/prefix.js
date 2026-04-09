const fs = require("fs-extra");
const path = require("path");
const https = require("https");
const { utils } = global;

module.exports = {
  config: {
    name: "prefix",
    version: "13.0",
    author: "Hridoy + Sabah",
    description: "Prefix info with random animation, gif and frame",
    category: "Utility"
  },

  onStart: async function ({ message, event, api }) {

    const ping = Date.now() - event.timestamp;
    const day = new Date().toLocaleString("en-US", { weekday: "long" });

    const BOTNAME = global.GoatBot.config.nickNameBot || "KakashiBot";
    const BOTPREFIX = global.GoatBot.config.prefix;
    const GROUPPREFIX = utils.getPrefix(event.threadID);

    // RANDOM LOADING ANIMATION SETS
    const loadingSets = [

      [
        "𝐋𝐨𝐚𝐝𝐢𝐧𝐠 𝐏𝐫𝐞𝐟𝐢𝐱...\n▰▱▱▱▱▱▱▱▱▱ 10%",
        "𝐋𝐨𝐚𝐝𝐢𝐧𝐠 𝐏𝐫𝐞𝐟𝐢𝐱...\n▰▰▰▱▱▱▱▱▱▱ 30%",
        "𝐋𝐨𝐚𝐝𝐢𝐧𝐠 𝐏𝐫𝐞𝐟𝐢𝐱...\n▰▰▰▰▰▱▱▱▱▱ 50%",
        "𝐋𝐨𝐚𝐝𝐢𝐧𝐠 𝐏𝐫𝐞𝐟𝐢𝐱...\n▰▰▰▰▰▰▰▱▱▱ 70%",
        "𝐋𝐨𝐚𝐝𝐢𝐧𝐠 𝐏𝐫𝐞𝐟𝐢𝐱...\n▰▰▰▰▰▰▰▰▰▱ 90%",
        "𝐋𝐨𝐚𝐝𝐢𝐧𝐠 𝐏𝐫𝐞𝐟𝐢𝐱...\n▰▰▰▰▰▰▰▰▰▰ 100%"
      ],

      [
        "𝙇𝙤𝙖𝙙𝙞𝙣𝙜 𝙋𝙧𝙚𝙛𝙞𝙭...\n[■□□□□□□□□□] 10%",
        "𝙇𝙤𝙖𝙙𝙞𝙣𝙜 𝙋𝙧𝙚𝙛𝙞𝙭 ...\n[■■■□□□□□□□] 30%",
        "𝙇𝙤𝙖𝙙𝙞𝙣𝙜 𝙋𝙧𝙚𝙛𝙞𝙭...\n[■■■■■□□□□□] 50%",
        "𝙇𝙤𝙖𝙙𝙞𝙣𝙜 𝙋𝙧𝙚𝙛𝙞𝙭...\n[■■■■■■■□□□] 70%",
        "𝙇𝙤𝙖𝙙𝙞𝙣𝙜 𝙋𝙧𝙚𝙛𝙞𝙭...\n[■■■■■■■■■□] 90%",
        "𝙇𝙤𝙖𝙙𝙞𝙣𝙜 𝙋𝙧𝙚𝙛𝙞𝙭...\n[■■■■■■■■■■] 100%"
      ],

      [
        "𝙻𝚘𝚊𝚍𝚒𝚗𝚐 𝙿𝚛𝚎𝚏𝚒𝚡...\n◉□□□□□□□□□ 10%",
        "𝙻𝚘𝚊𝚍𝚒𝚗𝚐 𝙿𝚛𝚎𝚏𝚒𝚡...\n◉◉◉□□□□□□□ 30%",
        "𝙻𝚘𝚊𝚍𝚒𝚗𝚐 𝙿𝚛𝚎𝚏𝚒𝚡...\n◉◉◉◉◉□□□□□ 50%",
        "𝙻𝚘𝚊𝚍𝚒𝚗𝚐 𝙿𝚛𝚎𝚏𝚒𝚡...\n◉◉◉◉◉◉◉□□□ 70%",
        "𝙻𝚘𝚊𝚍𝚒𝚗𝚐 𝙿𝚛𝚎𝚏𝚒𝚡...\n◉◉◉◉◉◉◉◉◉□ 90%",
        "𝙻𝚘𝚊𝚍𝚒𝚗𝚐 𝙿𝚛𝚎𝚏𝚒𝚡...\n◉◉◉◉◉◉◉◉◉◉ 100%"
      ]

    ];

    const frames = loadingSets[Math.floor(Math.random() * loadingSets.length)];

    const msg = await message.reply(frames[0]);

    for (let i = 1; i < frames.length; i++) {
      await new Promise(r => setTimeout(r, 1200));
      api.editMessage(frames[i], msg.messageID);
    }

    await new Promise(r => setTimeout(r, 800));
    api.unsendMessage(msg.messageID);

    // RANDOM GIFS
    const gifs = [
      "https://i.imgur.com/Xw6JTfn.gif",
      "https://i.imgur.com/KUFxWlF.gif",
      "https://i.imgur.com/FV9krHV.gif",
      "https://i.imgur.com/lFrFMEn.gif",
      "https://i.imgur.com/KbcCZv2.gif",
      "https://i.imgur.com/QC7AfxQ.gif",
      "https://i.imgur.com/KrEez4A.gif",
      "https://i.imgur.com/TtAOEAO.gif",
      "https://i.imgur.com/mW0yjZb.gif",
      "https://i.imgur.com/KQBcxOV.gif"
    ];

    const randomGif = gifs[Math.floor(Math.random() * gifs.length)];

    const cacheFolder = path.join(__dirname, "cache");
    if (!fs.existsSync(cacheFolder)) fs.mkdirSync(cacheFolder, { recursive: true });

    const gifName = path.basename(randomGif);
    const gifPath = path.join(cacheFolder, gifName);

    if (!fs.existsSync(gifPath)) {
      await new Promise((resolve, reject) => {
        const file = fs.createWriteStream(gifPath);
        https.get(randomGif, res => {
          res.pipe(file);
          file.on("finish", () => file.close(resolve));
        }).on("error", reject);
      });
    }

    // RANDOM PREFIX TEXT FRAMES
    const prefixFrames = [

`🌟╔═༶• 𝗣𝗥𝗘𝗙𝗜𝗫 𝗜𝗡𝗙𝗢 •༶═╗🌟
🕒 Ping: ${ping}ms
📅 Day: ${day}
💠 Bot Prefix: ${BOTPREFIX}
💬 Group Prefix: ${GROUPPREFIX}
🤖 Bot Name: ${BOTNAME}
🌟╚═༶• 𝗘𝗻𝗱 𝗢𝗳 𝗦𝘁𝗮𝘁𝘂𝘀 •༶═╝🌟`,

`╭━•✧𝗣𝗥𝗘𝗙𝗜𝗫 𝗦𝗧𝗔𝗧𝗨𝗦✧•━╮
│ ⏱ Ping: ${ping}ms
│ 📆 Day: ${day}
│ 🔹 Bot Prefix: ${BOTPREFIX}
│ 🔹 Group Prefix: ${GROUPPREFIX}
│ 🤖 Bot: ${BOTNAME}
╰━━━━━━━━━━━━━━━━╯`,

`┏━༺ 𝗣𝗥𝗘𝗙𝗜𝗫 𝗜𝗡𝗙𝗢 ༻━┓
┃ 🕒 Ping: ${ping}ms
┃ 📅 Day: ${day}
┃ 💠 Bot Prefix: ${BOTPREFIX}
┃ 💬 Group Prefix: ${GROUPPREFIX}
┃🤖 Bot Name: ${BOTNAME}
┗━━━━━━━━━━━━━━━━┛`,

`▸▸▸ 𝗣𝗥𝗘𝗙𝗜𝗫 𝗦𝗧𝗔𝗧𝗨𝗦 ◂◂◂
Ping: ${ping}ms
Day: ${day}
Bot Prefix: ${BOTPREFIX}
Group Prefix: ${GROUPPREFIX}
Bot Name: ${BOTNAME}`

    ];

    const randomText = prefixFrames[Math.floor(Math.random() * prefixFrames.length)];

    api.sendMessage({
      body: randomText,
      attachment: fs.createReadStream(gifPath)
    }, event.threadID);

  },

  onChat: async function ({ event, message, api }) {
    if (!event.body) return;

    if (event.body.toLowerCase().trim() === "prefix") {
      return this.onStart({ message, event, api });
    }
  }
};
