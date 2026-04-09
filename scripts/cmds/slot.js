module.exports = {
  config: {
    name: "slot",
    version: "1.1.0",
    author: "MahMUD",
    role: 0,
    category: "Game",
    guide: {
      en: "{pn} <amount>"
    }
  },

  langs: {
    en: {
      missingInput:
        "╔══════════════╗\n" +
        " ⚠️ 𝗦𝗟𝗢𝗧 𝗘𝗥𝗥𝗢𝗥\n" +
        "╚══════════════╝\n" +
        "❖ Invalid bet amount\n" +
        "💡 Please enter a valid number",

      moneyBetNotEnough:
        "╔══════════════╗\n" +
        " ❌ 𝗕𝗔𝗟𝗔𝗡𝗖𝗘 𝗟𝗢𝗪\n" +
        "╚══════════════╝\n" +
        "💸 You don't have enough coins",

      limitBet:
        "╔══════════════╗\n" +
        " ⚠️ 𝗕𝗘𝗧 𝗟𝗜𝗠𝗜𝗧\n" +
        "╚══════════════╝\n" +
        "💰 Minimum bet required: 50$",

      returnWin:
        "╔══════════════════════╗\n" +
        " 🎉 𝗦𝗟𝗢𝗧 𝗠𝗔𝗖𝗛𝗜𝗡𝗘 🎉\n" +
        "╠══════════════════════╣\n" +
        " 🎰  %1  │  %2  │  %3\n" +
        "╠══════════════════════╣\n" +
        " 💎✨ 𝗝𝗔𝗖𝗞𝗣𝗢𝗧 𝗪𝗜𝗡 ✨💎\n" +
        " 💰 𝗣𝗿𝗶𝘇𝗲:  +%4$\n" +
        "🔥 Luck is on your side!\n" +
        "╚══════════════════════╝",

      returnLose:
        "╔══════════════════════╗\n" +
        " 💔 𝗦𝗟𝗢𝗧 𝗠𝗔𝗖𝗛𝗜𝗡𝗘 💔\n" +
        "╠══════════════════════╣\n" +
        " 🎰  %1  │  %2  │  %3\n" +
        "╠══════════════════════╣\n" +
        " ☠️ 𝗕𝗘𝗧 𝗟𝗢𝗦𝗧\n" +
        " 💸 𝗟𝗼𝘀𝘀:  -%4$\n" +
        "😈 Try again if you dare\n" +
        "╚══════════════════════╝"
    }
  },

  onStart: async function ({ api, event, args, usersData, getLang }) {
    const { threadID, messageID, senderID } = event;

    const slotItems = ["🍒", "🍋", "🍉", "🍇", "7️⃣"];
    const userData = await usersData.get(senderID);
    const moneyUser = userData.money || 0;

    const bet = parseInt(args[0]);
    if (isNaN(bet) || bet <= 0)
      return api.sendMessage(getLang("missingInput"), threadID, messageID);

    if (bet < 50)
      return api.sendMessage(getLang("limitBet"), threadID, messageID);

    if (bet > moneyUser)
      return api.sendMessage(getLang("moneyBetNotEnough"), threadID, messageID);

    // 🎰 Random slots
    const a = Math.floor(Math.random() * slotItems.length);
    const b = Math.floor(Math.random() * slotItems.length);
    const c = Math.floor(Math.random() * slotItems.length);

    let win = false;
    let reward = bet;

    // ✅ WIN LOGIC (same as original)
    if (a === b && b === c) {
      reward = bet * 5; // jackpot
      win = true;
    } else if (a === b || a === c || b === c) {
      reward = bet * 2; // small win
      win = true;
    }

    if (win) {
      userData.money += reward;
      await usersData.set(senderID, userData);

      return api.sendMessage(
        getLang("returnWin", slotItems[a], slotItems[b], slotItems[c], reward),
        threadID,
        messageID
      );
    } else {
      userData.money -= bet;
      await usersData.set(senderID, userData);

      return api.sendMessage(
        getLang("returnLose", slotItems[a], slotItems[b], slotItems[c], bet),
        threadID,
        messageID
      );
    }
  }
};