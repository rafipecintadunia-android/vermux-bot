const http = require('http');
http.createServer((req,res)=>{res.write("VERMUX BOT JALAN 24 JAM!");res.end();}).listen(process.env.PORT||3000);
const TOKEN = process.env.BOT_TOKEN;
const API = `https://api.telegram.org/bot${TOKEN}`;
const ADMIN_ID = 9073018852;
const WA_NUMBER = "6285736394243";
let offset = 0;
async function kirim(chat_id, pesan, tombolWA=false) {
  let body = {chat_id, text: pesan};
  if (tombolWA) {
    body.reply_markup = {inline_keyboard: [[{text: "💬 Chat WhatsApp Admin", url: `https://wa.me/${WA_NUMBER}?text=Halo%20Admin%20Vermux%20Gresik,%20mau%20order!` }]]};
  }
  await fetch(`${API}/sendMessage`, {method: "POST", headers: {"Content-Type": "application/json"}, body: JSON.stringify(body)});
}
async function jalan() {
  console.log("VERMUX BOT 24 JAM JALAN!");
  while (true) {
    try {
      const res = await fetch(`${API}/getUpdates?offset=${offset}&timeout=30`);
      const data = await res.json();
      for (const u of data.result || []) {
        offset = u.update_id + 1;
        const msg = u.message;
        if (!msg || !msg.text) continue;
        const chat_id = msg.chat.id;
        const teks = msg.text;
        const lower = teks.toLowerCase();
        if (lower === "/start") {
          await kirim(chat_id, "Selamat datang di VERMUX GRESIK! 🛵\n\nMenu:\n/order - Cara Order\n/harga - Daftar Harga\n/wa - Chat WhatsApp\n/help - Bantuan\n\nKetik /order buat order!", true);
        } else if (lower === "/order") {
          await kirim(chat_id, "CARA ORDER VERMUX:\n\nKirim format gini:\nNAMA - JEMPUT - TUJUAN\n\nContoh:\nBudi - Gresik Kota - Menganti\n\nNanti langsung diteruskan ke Admin!");
        } else if (lower === "/harga") {
          await kirim(chat_id, "HARGA VERMUX GRESIK:\n\nDalam Kota Gresik: 10k-15k\nGresik - Menganti: 20k\nGresik - Driyorejo: 25k\nGresik - Cerme: 20k\n\nKetik /order buat order!", true);
        } else if (lower === "/wa") {
          await kirim(chat_id, "Chat Admin via WhatsApp langsung klik tombol di bawah!", true);
        } else if (lower === "/help") {
          await kirim(chat_id, "Ketik /start buat menu, /order buat order, /harga buat harga, /wa buat WhatsApp!");
        } else if (teks.includes("-")) {
          await kirim(chat_id, `✅ ORDER DITERIMA!\n\n${teks}\n\nAdmin Vermux Gresik segera hubungi kamu!`, true);
          if (chat_id != ADMIN_ID) {
            await kirim(ADMIN_ID, `🔥 ORDER BARU VERMUX!\n\nDari: ${msg.from.first_name} (@${msg.from.username || "-"})\nChat ID: ${chat_id}\n\nIsi Order:\n${teks}\n\nSegera hubungi customer!`);
          }
        } else {
          await kirim(chat_id, `Pesan kamu: "${teks}" udah diterima! Ketik /order buat order, /wa buat WhatsApp.`);
        }
      }
    } catch (e) { console.log("Error...", e.message); }
  }
}
jalan();
