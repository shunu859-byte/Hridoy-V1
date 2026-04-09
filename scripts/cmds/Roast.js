module.exports = {
  config: {
    name: "roast",
    aliases: ["ro"],
    version: "4.4",
    author: "Saim",
    countDown: 5,
    role: 1,
    shortDescription: {
      en: "Roast your mentioned friend line by line!"
    },
    longDescription: {
      en: "Sends savage roast lines with emoji, one by one. Admin only. Reply 'stop' to any roast to cancel."
    },
    category: "Tag Fun",
    guide: {
      en: "{pn} @mention"
    }
  },

  onStart: async function ({ message, api, event }) {
    const mentions = Object.keys(event.mentions);
    if (mentions.length === 0)
      return message.reply("❌ Please mention someone to roast.");

    const targetID = mentions[0];
    const targetName = event.mentions[targetID];
    const tagText = `@${targetName}`;

    const roasts = [
      "তোকে দেখে মনে হয় calculator-এও তুই ভুল দিস 😜.",
      "তুই এমন একটা অবস্থা, mirror তোকে ignore করে 😆.",
      "তুই লাস্ট bench-er গর্ব, কারণ তুইই কোনোদিন pass করিস না 🤦‍♂️.",
      "তোর IQ এত low, যে mosquito repellent-ও ignore করে 😅.",
      "তুই প্রেমে পড়িস না, প্রেম তোকে avoid করে 🥲.",
      "তুই মানুষ না meme, তোকে নিয়ে সবাই হাসে 🤣.",
      "তোর কাজ শুধু seen দিয়ে চুপ থাকা — তোকে ghost বানাতে পারতাম 👻.",
      "তুই এমন ধরা, তোকে block করেও শান্তি নাই 🚫.",
      "তুই এত useless, Google-e খুজলেও কাজের কিছু পাবি না 🧐.",
      "তোর কথা শুনে silence request করসে – চুপ থাকিস না একটু 🥱.",
      "তুই এমন personality, WhatsApp DP দেখেই বুঝে ফেলা যায় 🏠.",
      "তোর crush তোকে দেখে বলে, 'ভাই এই দিক দিয়া না' 😬.",
      "তুই একমাত্র friend, যারে tag দিলে পস্তাই 😒.",
      "তুই এত বেকার, keyboard-er spacebar-er মতো — underrated 🤖.",
      "তুই selfie দিলে camera reverse হয়ে যায় 🤳.",
      "তুই math এ এত বাজে, 2+2=22 বিশ্বাস করিস 📚.",
      "তুই joke করিস, হাসি আসে না — ঘুম আসে 💤.",
      "তুই class clown হইতে চাস, কিন্তু সবার stress হইস 😔.",
      "তুই এত bad, antivirus তোকে remove করতে পারে না 🦠.",
      "তুই রাগ করলে মানুষ ভয় পায় না, হাসে 😂.",
      "তোর attitude এত fake, barcode দিয়ে scan করা যায় 🏷️.",
      "তুই লজ্জা না shame, insult এর ব্র্যান্ড ambassador 👑.",
      "তুই dustbin-ও accept করে না, even trash has standards 🗑️.",
      "তোর বন্ধুত্ব — only when needed 💔.",
      "তোর crush তোকে দেখে auto correct হয় — Brother detected! 🔧.",
      "তুই এমন dull, candle ও জ্বলে না পাশে 🕯️.",
      "তুই face unlock দিস, phone ঘুমিয়ে পড়ে 😴.",
      "তুই selfie দিস, camera গালি দেয় 🏃‍♂️.",
      "তুই এত চিপ, discount-er নিচেও চলে যাস 💸.",
      "তুই হ্যান্ডসাম? হাহা, Google confirm করে নাই 😆."
    ];

    let currentIndex = 0;
    const threadID = event.threadID;

    function roastLoop() {
      if (currentIndex < roasts.length) {
        const body = `${currentIndex + 1}. ${tagText}, ${roasts[currentIndex]}`;
        api.sendMessage({
          body,
          mentions: [{ id: targetID, tag: tagText }]
        }, threadID, (err, info) => {
          global.lastRoastMessageID = info.messageID;
        });

        currentIndex++;
      } else {
        clearInterval(global.roastInterval);
        global.roastInterval = null;
      }
    }

    global.roastInterval = setInterval(roastLoop, 1500);

    message.reply(`🔥 Roasting ${targetName} started!\nReply "stop" to any roast to end it.`);
  },

  onChat: async function ({ event, message }) {
    if (
      event.body?.toLowerCase() === "stop" &&
      global.roastInterval &&
      event.messageReply &&
      event.messageReply.messageID === global.lastRoastMessageID
    ) {
      clearInterval(global.roastInterval);
      global.roastInterval = null;
      return message.reply("🛑 Roast process has been stopped!");
    }
  }
};