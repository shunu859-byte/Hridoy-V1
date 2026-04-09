module.exports = {
  config: {
    name: "support",
    version: "3.0",
    author: "Hridoy + Sabah",
    role: 0,
    shortDescription: "Join support group",
    longDescription: "Join official bot support group",
    category: "Utility",
    guide: "{pn}"
  },

  onStart: async function ({ api, event, message }) {

    const supportThread = "1226103469230159";
    const supportLink = "https://m.me/1226103469230159"; // support group link

    const { senderID } = event;

    try {

      await api.addUserToGroup(senderID, supportThread);

      return message.reply(`
╭───〔 BOT SUPPORT CENTER 〕───⭓

✅ You have been added to the
official support group.

If the group does not appear,
use the link below to join.

🔗 Support Group Link:
${supportLink}

⚡ Our support team will help you.

╰────────────────────⭓
`);

    } catch (e) {

      return message.reply(`
╭───〔 BOT SUPPORT CENTER 〕───⭓

⚠️ Auto add failed.

Please join manually using
the link below.

🔗 Support Group Link:
${supportLink}

🛠 Services:
• Bot Setup Help
• Command Request
• Bug Fix

╰────────────────────⭓
`);

    }

  }
};
