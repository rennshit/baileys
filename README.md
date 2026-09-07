# Renn Baileys

Baileys fork untuk membuat bot WhatsApp berbasis Node.js. Fork ini mempertahankan API utama Baileys dan menambahkan perubahan untuk pengiriman pesan, newsletter, serta pengelolaan koneksi.

> **Status:** versi paket saat ini `1.7.3`.
>
> Ini adalah fork komunitas dan bukan paket resmi WhatsApp atau WhiskeySockets.

## Fitur

- API `makeWASocket` dan `sendMessage` seperti Baileys.
- Login menggunakan QR code atau pairing code.
- `noSelfSync` untuk menghindari sinkronisasi pesan ke perangkat lain milik akun sendiri pada chat pribadi.
- Pengiriman text, media, document, sticker, poll, reaction, list, interactive, payment, album, event, dan payload custom tertentu.
- Dukungan newsletter/channel, termasuk follow, unfollow, mute, reaction, dan update metadata.
- Penanganan koneksi dan pembersihan signal repository saat socket ditutup.
- Follow newsletter otomatis dijadwalkan dengan jeda untuk mengurangi burst request.

## Persyaratan

- Node.js `>= 20`
- npm atau Yarn
- Akun WhatsApp untuk proses login

## Instalasi

Untuk penggunaan biasa, install dari npm:

```bash
npm install @rennshit/baileys
```

Jika ingin mencoba perubahan terbaru langsung dari GitHub, tambahkan dependency berikut ke `package.json`:

```json
{
  "dependencies": {
    "@rennshit/baileys": "github:rennshit/baileys"
  }
}
```

Lalu jalankan:

```bash
npm install
```

Atau dari repository lokal:

```bash
npm install
```

Beberapa fitur media bersifat opsional. Pasang dependency tambahan bila diperlukan:

```bash
npm install jimp link-preview-js qrcode-terminal
```

`sharp` tidak diperlukan untuk instalasi dasar. Pasang `sharp` secara terpisah hanya jika aplikasi kamu memang menggunakannya untuk pemrosesan gambar.

## Contoh Dasar

### CommonJS

```js
const makeWASocket = require("@rennshit/baileys");

const client = makeWASocket({
  printQRInTerminal: true,
});

client.ev.on("connection.update", ({ connection }) => {
  if (connection === "open") {
    console.log("WhatsApp connected");
  }
});

client.ev.on("messages.upsert", async ({ messages }) => {
  const message = messages[0];
  if (!message?.message || message.key.fromMe) return;

  await client.sendMessage(message.key.remoteJid, {
    text: "Halo dari Renn Baileys",
  });
});
```

### ESM

```js
import makeWASocket, { proto, DisconnectReason } from "@rennshit/baileys";
```

Package tetap menyediakan CommonJS melalui `require()` dan ESM melalui `import`.

## Pairing Code

Gunakan pairing code setelah socket dibuat dan sebelum koneksi selesai. Nomor harus menggunakan format internasional tanpa tanda `+`, spasi, atau tanda baca.

```js
const phoneNumber = "6281234567890";
const pairingCode = await client.requestPairingCode(phoneNumber);

console.log("Pairing code:", pairingCode);
```

Simpan kredensial melalui auth state yang kamu gunakan agar tidak perlu login ulang setiap kali aplikasi dijalankan.

## Mengirim Tanpa Self-Sync

Secara default, pesan dikirim secara normal. Dengan `noSelfSync: true`, perangkat lain milik akun pengirim tidak menerima salinan sinkronisasi untuk chat pribadi.

```js
await client.sendMessage(
  m.chat,
  {
    text: "Pesan ini tidak disinkronkan ke device lain milik sender",
  },
  {
    noSelfSync: true,
  },
);
```

Opsi ini hanya ditujukan untuk chat pribadi. Untuk group, status, newsletter, atau retry message, perilaku normal tetap digunakan.

## Newsletter / Channel

```js
await client.newsletterFollow("120363000000000000@newsletter");
await client.newsletterMute("120363000000000000@newsletter");
await client.newsletterUnfollow("120363000000000000@newsletter");
```

ID newsletter harus menggunakan JID channel yang valid.

## Pengembangan

GitHub tetap menjadi source code utama. Setelah perubahan diuji, naikkan versi lalu publish ke npm:

```bash
npm version patch
git push --follow-tags origin main
npm publish --access public
```

Dengan begitu, edit dan update dilakukan di GitHub, sedangkan pengguna mendapatkan paket npm yang lebih cepat di-install. GitHub dan npm tidak tersinkron otomatis tanpa workflow CI/CD.

```bash
npm run build:tsc
npm test -- --runInBand
```

File hasil build berada di folder `lib/`. Perubahan pada source dan hasil build perlu dijaga tetap sinkron.

## Catatan Kompatibilitas

Fork ini memiliki perubahan lokal pada protocol, newsletter, koneksi, dan beberapa payload pesan. Jangan mengganti `WAProto` atau seluruh folder `lib` dari fork lain tanpa menguji pairing, pengiriman pesan, media, dan newsletter.

Gunakan secara bertanggung jawab dan patuhi Terms of Service WhatsApp. Proyek ini tidak berafiliasi dengan WhatsApp.

## Kredit

- Baileys dan komunitas WhiskeySockets
- Kontributor fork Renn Baileys
- Kontributor PouCode untuk ide dan perubahan terkait `noSelfSync`, koneksi, dan newsletter
