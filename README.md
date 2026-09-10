# Renn Baileys

Fork Baileys untuk Node.js dengan pembaruan koneksi WhatsApp Web, pairing code, rich message, dan dukungan ESM.

> Community fork. Tidak berafiliasi dengan WhatsApp atau WhiskeySockets.

[![Node.js](https://img.shields.io/badge/node-%3E%3D20-brightgreen.svg)](package.json)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

## Fitur Utama

- ESM penuh dengan `import`.
- Login QR code dan pairing code.
- Generator `generateWAMessage`, `generateWAMessageContent`, dan `generateWAMessageFromContent`.
- Rich message: text, table, list, code block, LaTeX, interactive, media, poll, product, event, dan album.
- `noSelfSync` untuk menghindari sinkronisasi pesan ke device lain milik sender.
- Newsletter/channel API tanpa auto-join saat startup.
- WAProto dan koneksi berbasis update terbaru WhatsApp Web.

## Persyaratan

- Node.js `>= 20`
- Akun WhatsApp untuk proses login
- Project menggunakan ESM, misalnya `"type": "module"` di `package.json`

## Instalasi

Install versi terbaru dari branch `main`:

```bash
npm install github:rennshit/baileys#main
```

Agar kode lama tetap memakai nama package Baileys:

```json
{
  "type": "module",
  "dependencies": {
    "@whiskeysockets/baileys": "github:rennshit/baileys#main"
  }
}
```

Setelah update, restart aplikasi. Tidak ada proses install otomatis saat bot dijalankan.

## Quick Start

```js
import makeWASocket, {
  Browsers,
  useMultiFileAuthState,
} from "@whiskeysockets/baileys";

const { state, saveCreds } = await useMultiFileAuthState("auth");

const client = makeWASocket({
  auth: state,
  browser: Browsers.renn("Chrome"),
  printQRInTerminal: true,
});

client.ev.on("creds.update", saveCreds);

client.ev.on("connection.update", ({ connection }) => {
  if (connection === "open") {
    console.log("WhatsApp connected");
  }
});

client.ev.on("messages.upsert", async ({ messages }) => {
  const message = messages[0];
  if (!message?.message || message.key.fromMe) return;

  await client.sendMessage(message.key.remoteJid, {
    text: "Hello from Renn Baileys",
  });
});
```

## Pairing Code

Gunakan nomor internasional tanpa tanda `+`, spasi, atau tanda baca.

```js
const code = await client.requestPairingCode("6281234567890");
console.log("Pairing code:", code);
```

Format JID juga diterima:

```js
const code = await client.requestPairingCode("6281234567890@s.whatsapp.net");
```

Panggil pairing setelah socket dibuat, lalu simpan credentials melalui `saveCreds`.

## Mengirim Pesan

```js
await client.sendMessage("6281234567890@s.whatsapp.net", {
  text: "Pesan text",
});

await client.sendMessage("6281234567890@s.whatsapp.net", {
  image: { url: "./image.jpg" },
  caption: "Pesan gambar",
});
```

## Rich Message

Rich message memakai `sendRichMessage` dan dapat berisi beberapa submessage.

```js
await client.sendRichMessage(
  "6281234567890@s.whatsapp.net",
  [
    { messageType: 2, messageText: "Data akun" },
    {
      messageType: 4,
      tableMetadata: {
        title: "Status",
        rows: [{ items: ["Nama", "Renn"] }, { items: ["Status", "Aktif"] }],
      },
    },
  ],
  undefined,
);
```

Helper tambahan yang tersedia:

```js
await client.sendTable(jid, "Judul", ["Kolom 1", "Kolom 2"], rows);
await client.sendList(jid, "Daftar", ["Item 1", "Item 2"]);
await client.sendCodeBlock(jid, "console.log('hello')", undefined, {
  language: "javascript",
});
```

Rich message dibuat untuk chat biasa. Dukungan rendering di `status@broadcast` bergantung pada tipe payload WhatsApp; text dan media lebih aman untuk status.

## noSelfSync

`noSelfSync` hanya berlaku untuk chat pribadi. Pesan tetap dikirim ke penerima, tetapi tidak disinkronkan ke device lain milik akun pengirim, dan juga tidak di-append ke store lokal pengirim.

```js
await client.sendMessage(
  jid,
  {
    text: "Pesan tanpa self-sync",
  },
  {
    noSelfSync: true,
  },
);
```

Default-nya adalah `false`. Group, status, newsletter, dan retry message tetap memakai perilaku normal.

## Newsletter / Channel

Tidak ada auto-join channel atau newsletter saat startup. Follow hanya dilakukan jika dipanggil secara manual:

```js
await client.newsletterFollow("120363000000000000@newsletter");
await client.newsletterUnfollow("120363000000000000@newsletter");
```

## Export Generator

```js
import {
  generateWAMessage,
  generateWAMessageContent,
  generateWAMessageFromContent,
} from "@whiskeysockets/baileys";
```

## Catatan Kompatibilitas

Package ini menggunakan ESM dan WAProto terbaru. Gunakan `import`, bukan `require()`. Jika project kamu masih CommonJS, tambahkan `"type": "module"` atau migrasikan entry point aplikasi ke ESM.

Saat update dari versi GitHub, gunakan:

```bash
npm install github:rennshit/baileys#main --force
```

Gunakan `--force` hanya saat npm masih memakai cache atau commit lama.

## Pengembangan

```bash
npm install
npm run build:tsc
npm test -- --runInBand
```

## Kredit dan Lisensi

Renn Baileys dibangun di atas Baileys oleh WhiskeySockets dan kontribusi komunitas. Lihat [LICENSE](LICENSE) untuk informasi lisensi lengkap.

Repository: https://github.com/rennshit/baileys
