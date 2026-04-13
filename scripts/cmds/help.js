const fs = require("fs-extra");
const path = require("path");
const https = require("https");

module.exports = {
  config: {
    name: "help",
    aliases: ["menu"],
    version: "11.0",
    author: "AKASH x HRIDOY",
    shortDescription: "Animated Help Menu With Category Filter",
    category: "System",
    guide: "{pn}help [command | all]"
  },

  onStart: async function ({ message, args, prefix, api }) {

    const commandsMap = global.GoatBot.commands;
    const categories = {};
    const commands = [];

    // ===== CATEGORY WHITELIST =====
    const allowedCategories = [
      "AI",
      "Group",
      "Image",
      "Game",
      "Love",
     "Tag Fun",
      "Media"
    ];

    // ===== SINGLE COMMAND INFO =====
    if (args[0] && args[0] !== "all") {
      const cmd = commandsMap.get(args[0].toLowerCase());
      if (!cmd) return message.reply("❌ Command not found!");

      return message.reply(
`╭──❏ 𝐂𝐨𝐦𝐦𝐚𝐧𝐝 𝐈𝐧𝐟𝐨 ❏──╮
│ ✧ Name: ${cmd.config.name}
│ ✧ Category: ${cmd.config.category}
│ ✧ Description: ${cmd.config.shortDescription}
│ ✧ Usage: ${prefix}${cmd.config.name}
╰─────────────────────⭓`
      );
    }

    // ===== BUILD CATEGORY SYSTEM =====
    for (let [name, cmd] of commandsMap) {
      const cat = cmd.config.category || "Others";

      // If not using "all", filter category
      if (args[0] !== "all") {
        if (!allowedCategories.includes(cat)) continue;
      }

      if (!categories[cat]) categories[cat] = [];
      categories[cat].push(name);
      commands.push(name);
    }

    for (let cat in categories)
      categories[cat].sort();

    // ===== LOADING ANIMATION =====
    const loadingFrames = [
      "𝐋𝐨𝐚𝐝𝐢𝐧𝐠 𝐇𝐞𝐥𝐩 𝐌𝐞𝐧𝐮...\n▰▱▱▱▱▱▱▱▱▱ 10%",
      "𝐋𝐨𝐚𝐝𝐢𝐧𝐠 𝐇𝐞𝐥𝐩 𝐌𝐞𝐧𝐮...\n▰▰▰▱▱▱▱▱▱▱ 30%",
      "𝐋𝐨𝐚𝐝𝐢𝐧𝐠 𝐇𝐞𝐥𝐩 𝐌𝐞𝐧𝐮...\n▰▰▰▰▰▱▱▱▱▱ 50%",
      "𝐋𝐨𝐚𝐝𝐢𝐧𝐠 𝐇𝐞𝐥𝐩 𝐌𝐞𝐧𝐮...\n▰▰▰▰▰▰▰▱▱▱ 70%",
      "𝐋𝐨𝐚𝐝𝐢𝐧𝐠 𝐇𝐞𝐥𝐩 𝐌𝐞𝐧𝐮...\n▰▰▰▰▰▰▰▰▰▱ 90%",
      "𝐋𝐨𝐚𝐝𝐢𝐧𝐠 𝐇𝐞𝐥𝐩 𝐌𝐞𝐧𝐮...\n▰▰▰▰▰▰▰▰▰▰ 100%"
    ];

    let loadingMsg = await message.reply(loadingFrames[0]);

    for (let i = 1; i < loadingFrames.length; i++) {
      await new Promise(res => setTimeout(res, 400));
      await api.editMessage(loadingFrames[i], loadingMsg.messageID);
    }

    // ===== BUILD HELP TEXT =====
    let msg = `╭──❏ 𝐂𝐮𝐬𝐭𝐨𝐦 𝐇𝐞𝐥𝐩 𝐌𝐞𝐧𝐮 ❏──╮\n`;
    msg += `│ ✧ Total Commands: ${commands.length}\n`;
    msg += `│ ✧ Prefix: ${prefix}\n`;
    msg += `╰─────────────────────⭓\n\n`;

    for (let [cat, cmds] of Object.entries(categories)) {

      msg += `╭─‣ 𝗖𝗮𝘁𝗲𝗴𝗼𝗿𝘆 : ${cat}\n`;

      for (let i = 0; i < cmds.length; i += 2) {
        const row = [`「${cmds[i]}」`];
        if (cmds[i + 1])
          row.push(`✘ 「${cmds[i + 1]}」`);

        msg += `├‣ ${row.join(" ")}\n`;
      }

      msg += `╰────────────◊\n\n`;
    }

    msg += `⭔ Type ${prefix}help [command]\n`;
    msg += `⭔ Type ${prefix}help all (Show All)\n\n`;
    msg += `╭─[⋆˚🦋k̶a̶k̶a̶s̶h̶i̶X̶t̶o̶r̶u̶🎀⋆˚]\n`;
    msg += `╰‣ Admin : Kakashi Hatake\n`;
    msg += `╰‣ Report : .callad (yourmsg)\n`;

    // ===== RANDOM GIF =====
    const gifURLs = [
      "https://i.imgur.com/zex8uo7.gif",
      "https://i.imgur.com/4ki8eBI.gif",
      "https://i.imgur.com/AMKQCJc.gif",
      "https://i.imgur.com/rkjO7YV.gif",
      "https://i.imgur.com/SgNPn8E.gif",
      "https://i.imgur.com/u3qB5y2.gif",
      "https://i.imgur.com/KUFxWlF.gif",
      "https://i.imgur.com/FV9krHV.gif",
      "https://i.imgur.com/lFrFMEn.gif",
      "https://i.imgur.com/KrEez4A.gif"
    ];

    const randomGifURL = gifURLs[Math.floor(Math.random() * gifURLs.length)];
    const gifFolder = path.join(__dirname, "cache");

    if (!fs.existsSync(gifFolder))
      fs.mkdirSync(gifFolder, { recursive: true });

    const gifName = path.basename(randomGifURL);
    const gifPath = path.join(gifFolder, gifName);

    if (!fs.existsSync(gifPath))
      await downloadGif(randomGifURL, gifPath);

    // Remove loading
    await api.unsendMessage(loadingMsg.messageID);

    // Send final help
    const sent = await message.reply({
      body: msg,
      attachment: fs.createReadStream(gifPath)
    });

    // ===== AUTO DELETE AFTER 30s =====
    setTimeout(() => {
      api.unsendMessage(sent.messageID);
    }, 30000);

  }
};

// ===== DOWNLOAD FUNCTION =====
function downloadGif(url, dest) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(dest);
    https.get(url, response => {
      response.pipe(file);
      file.on("finish", () => {
        file.close(resolve);
      });
    }).on("error", err => {
      fs.unlink(dest);
      reject(err);
    });
  });
      }
