const axios = require('axios');
const jimp = require("jimp");
const fs = require("fs");

module.exports = {
    config: {
        name: "marry",
        aliases: ["marry"],
        version: "1.2",
        author: "Unknown",
        countDown: 5,
        role: 0,
        shortDescription: "Get a virtual marriage photo",
        longDescription: "Mention someone to marry them virtually with a cute photo and message",
        category: "Love",
        guide: "{pn} @mention"
    },

    onStart: async function ({ message, event, usersData }) {
        const mention = Object.keys(event.mentions);

        if (mention.length === 0) return message.reply("Please mention someone to marry! 💍");

        // Marriage Pair
        let one, two;
        if (mention.length === 1) {
            one = event.senderID;
            two = mention[0];
        } else {
            one = mention[1];
            two = mention[0];
        }

        // Get names
        const name1 = await usersData.getName(one);
        const name2 = await usersData.getName(two);

        // Romantic / funny message list
        const messages = [
            `❤️ ${name1} just proposed to ${name2}! 🥰`,
            `💍 ${name1} and ${name2} are officially a couple now!`,
            `👰‍♀️🤵‍♂️ Congrats ${name1} & ${name2}, love is in the air! 😘`,
            `🌹 Wedding bells for ${name1} & ${name2}! 💒`,
            `💕 ${name1}, you're now stuck with ${name2}!`,
            `🔥 ${name2}, you complete ${name1}. Perfect couple! ❤️`,
            `🎉 Big news: ${name1} just married ${name2}! (virtually 😜)`,
            `💑 From tag to forever — ${name1} & ${name2} 💘`,
            `😻 Love alert: ${name1} ❤ ${name2} 💞`,
            `💫 Two souls, one bot marriage! Congrats ${name1} and ${name2}!`,
            `🪄 And just like that... ${name1} belongs to ${name2} 😉`
        ];

        const randomMessage = messages[Math.floor(Math.random() * messages.length)];

        try {
            const imagePath = await createMarriageImage(one, two);
            message.reply({
                body: randomMessage,
                attachment: fs.createReadStream(imagePath)
            }, () => fs.unlinkSync(imagePath)); // Clean up file after send
        } catch (err) {
            console.error(err);
            message.reply("Something went wrong while generating the image.");
        }
    }
};

// Function to create image
async function createMarriageImage(one, two) {
    const path = `marry_${Date.now()}.png`;

    // Read profile pictures
    const avone = await jimp.read(`https://graph.facebook.com/${one}/picture?width=512&height=512&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`);
    const avtwo = await jimp.read(`https://graph.facebook.com/${two}/picture?width=512&height=512&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`);

    avone.circle();
    avtwo.circle();

    // Background image
    const bg = await jimp.read("https://i.imgur.com/qyn1vO1.jpg");

    bg.resize(432, 280)
      .composite(avone.resize(60, 60), 189, 15)
      .composite(avtwo.resize(60, 60), 122, 25);

    await bg.writeAsync(path);
    return path;
  }