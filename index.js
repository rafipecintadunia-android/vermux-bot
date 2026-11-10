const TOKEN = "9234284409:AAHiYA6a8WbiDmv5795RQ59kXWzkNhMLUGw";
const ADMIN_CHAT_ID = "9073018852";
const WA_ADMIN = "6285736394243";

async function send(chatId, text, replyMarkup) {
  const body = { chat_id: chatId, text: text, parse_mode: "HTML" };
  if (replyMarkup) body.reply_markup = replyMarkup;
  await fetch(`https://api.telegram.org/bot${TOKEN}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body)
  });
}

async function getUpdates(offset) {
  const r = await fetch(`https://api.telegram.org/bot${TOKEN}/getUpdates?timeout=30&offset=${offset}`);
  const d = await r.json();
  return d.result || [];
}

console.log("VERMUX BOT 24 JAM JALAN!");
let offset = 0;
async function main() {
while (true) {
  try {
    const updates = await getUpdates(offset);
    for (const u of updates) {
      offset = u.update_id + 1;
      const msg = u.message;
      if (!msg || !msg.text) continue;
      const chatId = msg.chat.id;
      const text = msg.text.trim();
      const nama = msg.from.first_name || "Kak";

      if (text === "/start") {
        await send(chatId, `Halo ${nama}! 👋\n\nSelamat datang di <b>VERMUX GRESIK</b> 🚗\n\nJasa Antar Jemput Area Gresik!\n\nKetik:\n/order - Cara Order\n/harga - Cek Harga\n/wa - Chat Admin WA`);
      } else if (text === "/order") {
        await send(chatId, `<b>CARA ORDER:</b>\n\nKirim format gini:\n\nNAMA - JEMPUT - TUJUAN\n\nContoh:\nRafi - Menganti - Gresik Kota\n\nNanti langsung diteruskan ke Admin!`);
      } else if (text === "/harga") {
        await send(chatId, `<b>HARGA VERMUX GRESIK:</b>\n\n- Menganti: 20k\n- Driyorejo: 25k\n- Gresik Kota: 30k\n- Kebomas: 25k\n\nHarga bisa nego, chat admin aja!`);
      } else if (text === "/wa") {
        await send(chatId, `Chat Admin langsung di WA ya!`, { inline_keyboard: [[{ text: "💬 Chat WA Admin", url: `https://wa.me/${WA_ADMIN}` }]] });
      } else if (text.includes(" - ")) {
        await send(chatId, `✅ Order kamu diteruskan ke Admin!\n\nTunggu ya, Admin akan chat kamu sebentar lagi! 🙏`);
        await send(ADMIN_CHAT_ID, `🔥 <b>ORDER BARU!</b>\n\nDari: ${nama}\nUsername: @${msg.from.username || "-"}\nIsi: ${text}`);
      } else {
        await send(chatId, `Halo ${nama}! Ketik /start buat liat menu ya!`);
      }
    }
  } catch (e) { console.log("Error:", e.message); await new Promise(r => setTimeout(r, 3000)); }
}
}
main();