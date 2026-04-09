const moment = require("moment-timezone");
const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");

module.exports.config = {
  name: "prayerTimer",
  version: "1.1",
  role: 0,
  author: "Hridoy", // ক্রেডিট চেঞ্জ করলে ফাইল অফ হয়ে যাবে 
  description: "নামাজ টাইমে ভিডিও + Random Dua সহ মেসেজ যাবে",
  category: "Utility",
  countDown: 5,
};

// 🔐 Credit Protection
if (module.exports.config.author !== "Hridoy") {
  console.log("❌ Credit changed! File stopped.");
  return;
}

module.exports.onLoad = async function ({ api }) {

  const prayerTimes = {
    "05:00 AM": "🕌 ফজরের নামাজের সময় হয়েছে",
    "01:15 PM": "🕌 যোহরের নামাজের সময় হয়েছে",
    "04:30 PM": "🕌 আসরের নামাজের সময় হয়েছে",
    "06:15 PM": "🕌 মাগরিবের নামাজের সময় হয়েছে",
    "08:00 PM": "🕌 এশার নামাজের সময় হয়েছে"
  };

  const duas = [
    "🤲 اللّهُمَّ اغْفِرْ لِي وَارْحَمْنِي\nহে আল্লাহ, আমাকে ক্ষমা করুন ও দয়া করুন",
    "🤲 رَبِّ زِدْنِي عِلْمًا\nহে আমার রব, আমার জ্ঞান বৃদ্ধি করুন",
    "🤲 اللّهُمَّ اهْدِنِي الصِّرَاطَ الْمُسْتَقِيمَ\nহে আল্লাহ, আমাকে সরল পথে পরিচালিত করুন",
    "🤲 رَبَّنَا تَقَبَّلْ مِنَّا\nহে আমাদের রব, আমাদের আমল কবুল করুন",
    "🤲 اللّهُمَّ ارْزُقْنِي حَلَالًا طَيِّبًا\nহে আল্লাহ, আমাকে হালাল রিযিক দান করুন"
  ];

  const sentToday = {};

  console.log("🕌 Prayer Timer Loaded with Dua System...");

  const checkPrayer = async () => {
    const now = moment().tz("Asia/Dhaka").format("hh:mm A");

    if (prayerTimes[now] && !sentToday[now]) {

      sentToday[now] = true;

      const timeNow = moment().tz("Asia/Dhaka").format("hh:mm A");
      const dateNow = moment().tz("Asia/Dhaka").format("DD-MM-YYYY");

      const randomDua = duas[Math.floor(Math.random() * duas.length)];

      const finalMsg =
`━━━━━━━━━━━━━━━━━━
${prayerTimes[now]}
🕒 সময়: ${timeNow}
📅 তারিখ: ${dateNow}
━━━━━━━━━━━━━━━━━━

📿 দোয়া:
${randomDua}

◢◤━━━━━━━━━━━━━━━━◥◣
🤖 ʙᴏᴛ ᴏᴡɴᴇʀ:-ᴋᴀᴋᴀsʜɪ
🤲 সবাই নামাজ আদায় করুন
◥◣━━━━━━━━━━━━━━━━◢◤`;

      try {
        const allThreads = await api.getThreadList(100, null, ["INBOX"]);
        const groupThreads = allThreads.filter(t => t.isGroup);

        const cacheDir = path.join(__dirname, "cache");
        const filePath = path.join(cacheDir, "azan.mp4");

        // 📁 cache folder create
        if (!fs.existsSync(cacheDir)) {
          fs.mkdirSync(cacheDir);
        }

        // 🎥 download if not exists
        if (!fs.existsSync(filePath)) {
          const res = await axios({
            url: "https://files.catbox.moe/gr8zqw.mp4",
            method: "GET",
            responseType: "stream"
          });

          await new Promise((resolve, reject) => {
            const writer = fs.createWriteStream(filePath);
            res.data.pipe(writer);
            writer.on("finish", resolve);
            writer.on("error", reject);
          });
        }

        for (const thread of groupThreads) {
          await api.sendMessage({
            body: finalMsg,
            attachment: fs.createReadStream(filePath)
          }, thread.threadID);
        }

        console.log("✅ নামাজ + দোয়া + আজান পাঠানো হয়েছে");

      } catch (err) {
        console.error("❌ Prayer Timer Error:", err);
      }
    }

    // 🔄 reset
    if (moment().format("HH:mm") === "00:00") {
      for (let key in sentToday) delete sentToday[key];
    }
  };

  setInterval(checkPrayer, 20000); // একটু বেশি accurate
};

module.exports.onStart = () => {};
