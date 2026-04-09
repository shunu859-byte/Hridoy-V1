const fs = require("fs-extra");
const path = require("path");
const axios = require("axios");
const { Canvas, loadImage } = require("canvas");

const dbPath = path.join(__dirname, "../../data/bot.json");

module.exports = {
  config: {
    name: "top",
    aliases: ["balldb", "topbalance"],
    version: "1.12-loading-fixed",
    author: "Fixed loading + db path",
    countDown: 15,
    role: 0,
    description: { en: "Balance leaderboard with glow + fixed loading animation" },
    category: "Game",
    guide: { en: "{pn} [page number]" },
    envConfig: {
      ACCESS_TOKEN: "6628568379%7Cc1e620fa708a1d5696fb991c1bde5662"
    }
  },

  onStart: async function({ api, event, args, message }) {
    if (!fs.existsSync(dbPath)) return message.reply("Database not found.");
    let db;
    try { db = JSON.parse(fs.readFileSync(dbPath, "utf8")); }
    catch { return message.reply("Database corrupted."); }

    // === Loading Animation (same message edit + unsend at end) ===
    const loadingStages = [
      "𝐋𝐨𝐚𝐝𝐢𝐧𝐠 𝐋𝐞𝐚𝐝𝐞𝐫𝐛𝐨𝐚𝐫𝐝...\n▰▱▱▱▱▱▱▱▱▱ 10%",
      "𝐋𝐨𝐚𝐝𝐢𝐧𝐠 𝐋𝐞𝐚𝐝𝐞𝐫𝐛𝐨𝐚𝐫𝐝...\n▰▰▰▱▱▱▱▱▱▱ 30%",
      "𝐋𝐨𝐚𝐝𝐢𝐧𝐠 𝐋𝐞𝐚𝐝𝐞𝐫𝐛𝐨𝐚𝐫𝐝...\n▰▰▰▰▰▱▱▱▱▱ 50%",
      "𝐋𝐨𝐚𝐝𝐢𝐧𝐠 𝐋𝐞𝐚𝐝𝐞𝐫𝐛𝐨𝐚𝐫𝐝...\n▰▰▰▰▰▰▰▱▱▱ 70%",
      "𝐋𝐨𝐚𝐝𝐢𝐧𝐠 𝐋𝐞𝐚𝐝𝐞𝐫𝐛𝐨𝐚𝐫𝐝...\n▰▰▰▰▰▰▰▰▰▱ 90%",
      "𝐋𝐨𝐚𝐝𝐢𝐧𝐠 𝐋𝐞𝐚𝐝𝐞𝐫𝐛𝐨𝐚𝐫𝐝...\n▰▰▰▰▰▰▰▰▰▰ 100%"
    ];

    let loadingMsg = await api.sendMessage({ body: loadingStages[0] }, event.threadID);

    for (let i = 1; i < loadingStages.length; i++) {
      await new Promise(r => setTimeout(r, 600));
      try { await api.editMessage(loadingStages[i], loadingMsg.messageID); } catch {}
    }

    // ✅ লোডিং শেষ হলে loading message unsend
    try { await api.unsendMessage(loadingMsg.messageID); } catch {}

    // === Balance Data Load ===
    const threadInfo = await api.getThreadInfo(event.threadID);
    const members = threadInfo.participantIDs;

    let data = [];
    for (const uid of members) {
      const money = (db.users && db.users[uid] && db.users[uid].money) || 0;
      let name = "Facebook User";
      try {
        const userInfo = await api.getUserInfo(uid);
        name = userInfo[uid] ? (userInfo[uid].name || name) : name;
      } catch {}
      data.push({ uid, name, money, rank: 0 });
    }

    data.sort((a, b) => b.money - a.money);
    data.forEach((u, i) => u.rank = i + 1);

    const page = parseInt(args[0]) || 1;
    const perPage = 11;
    const start = (page - 1) * perPage;
    const pageData = data.slice(start, start + perPage);

    if (pageData.length === 0) return message.reply("No more pages.");

    // === Canvas Draw ===
    const canvas = new Canvas(1200, 1700);
    const ctx = canvas.getContext("2d");
    const BACKGROUND = "https://i.imgur.com/jMrPT8g.jpeg";
    let bg;
    try { bg = await loadImage(BACKGROUND); } catch {}
    if (bg) ctx.drawImage(bg, 0, 0, 1200, 1700);
    ctx.fillStyle = "rgba(0,0,0,0.8)";
    ctx.fillRect(0, 0, 1200, 1700);

    const ACCESS_TOKEN = this.config.envConfig.ACCESS_TOKEN || "";
    const glowColors = ["#FFD700","#FF4500","#00FFFF","#FF00FF","#00FF9D","#FFA500","#1E90FF","#FF69B4"];

    const getAvatar = async (uid) => {
      try {
        let url = `https://graph.facebook.com/${uid}/picture?width=512&height=512`;
        if (ACCESS_TOKEN) url += `&access_token=${ACCESS_TOKEN}`;
        const res = await axios.get(url, { responseType: "arraybuffer", timeout: 10000 });
        return await loadImage(res.data);
      } catch {
        return await loadImage("https://i.imgur.com/blank_avatar.png");
      }
    };

    const drawAvatar = (ctx, img, x, y, r) => {
      if (!img) return;
      ctx.save();
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI*2);
      ctx.clip();
      ctx.drawImage(img, x-r, y-r, r*2, r*2);
      ctx.restore();
    };

    // === Top 3 ===
    if (page === 1) {
      const top3 = data.slice(0,3);
      const pos = [{x:600,y:280,r:110},{x:300,y:380,r:85},{x:900,y:380,r:85}];
      for (let i=0;i<top3.length;i++){
        const user = top3[i];
        const avatar = await getAvatar(user.uid);
        const cx=pos[i].x,cy=pos[i].y,color=glowColors[i%glowColors.length];
        ctx.shadowColor=color; ctx.shadowBlur=35;
        ctx.beginPath(); ctx.arc(cx,cy,pos[i].r+15,0,Math.PI*2); ctx.fillStyle=color+"30"; ctx.fill();
        ctx.shadowBlur=0;
        drawAvatar(ctx,avatar,cx,cy,pos[i].r);
        ctx.fillStyle="#ffffff"; ctx.font="bold 42px Arial"; ctx.textAlign="center"; ctx.fillText(user.name,cx,cy+pos[i].r+70);
        ctx.font="bold 36px Arial"; ctx.fillText(`$${user.money}`,cx,cy+pos[i].r+120);
      }
    }

    // === List 4-11 ===
    let yStart = page===1?620:180;
    for (const user of pageData){
      if(page===1 && user.rank<=3) continue;
      const color = glowColors[(user.rank-1)%glowColors.length];
      ctx.fillStyle="rgba(10,10,30,0.85)"; ctx.fillRect(40,yStart,1120,110);
      ctx.fillStyle="#ffffff"; ctx.font="bold 50px Arial"; ctx.textAlign="left"; ctx.fillText(`#${user.rank}`,80,yStart+70);
      const avatar=await getAvatar(user.uid);
      const ax=220,ay=yStart+55;
      ctx.shadowColor=color; ctx.shadowBlur=25; ctx.beginPath(); ctx.arc(ax,ay,57,0,Math.PI*2); ctx.fillStyle=color+"40"; ctx.fill();
      ctx.shadowBlur=0;
      drawAvatar(ctx,avatar,ax,ay,45);
      ctx.fillStyle="#ffffff"; ctx.font="bold 36px Arial"; ctx.fillText(user.name,320,yStart+70);
      ctx.textAlign="right"; ctx.font="bold 40px Arial"; ctx.fillText(`$${user.money}`,1140,yStart+70);
      yStart+=130;
    }

    ctx.textAlign="center"; ctx.fillStyle="#dddddd"; ctx.font="28px Arial";
    ctx.fillText(`Page ${page} • Reply with page number to see more`,600,1630);

    const cachePath = path.join(__dirname,"cache","top_balance.png");
    await fs.ensureDir(path.dirname(cachePath));
    const out = fs.createWriteStream(cachePath);
    canvas.createPNGStream().pipe(out);

    out.on("finish",()=>{ message.reply({ body:`💰 Balance Leaderboard - Page ${page}`, attachment: fs.createReadStream(cachePath) }); });
  }
};
