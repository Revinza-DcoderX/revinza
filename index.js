console.clear()
console.log('\x1b[33m==============================\x1b[0m')
console.log('\x1b[32m   DARK VADER VERSION 1.0\x1b[0m')
console.log('\x1b[33m==============================\x1b[0m')
console.log('\x1b[36mStatus:\x1b[0m Bot Telegram aktif...')

const { Telegraf } = require('telegraf')
const config = require('./config')
const fs = require('fs')
const { default: makeWASocket, useMultiFileAuthState, makeInMemoryStore, useSingleFileAuthState, fetchLatestBaileysVersion, generateWAMessageFromContent, jidDecode } = require('@whiskeysockets/baileys')
const bot = new Telegraf(config.token)

const db = {
  owner: JSON.parse(fs.readFileSync('./admins.json')),
  admin: JSON.parse(fs.readFileSync('./admins.json')),
  premium: JSON.parse(fs.readFileSync('./premiumUsers.json')),
  activity: JSON.parse(fs.readFileSync('./userActivity.json')),
}

// Pairing via OTP (kode pairing dikirim ke Telegram)
bot.command('pairing', async (ctx) => {
  ctx.reply('🔁 Menyiapkan pairing WhatsApp via OTP...')

  const { state, saveCreds } = await useMultiFileAuthState('baileys_auth')
  const sock = makeWASocket({
    auth: state,
    printQRInTerminal: false,
    browser: ['DARK-VADER', 'Chrome', '1.0']
  })

  sock.ev.on('connection.update', async (update) => {
    const { connection, pairingCode, qr } = update

    if (pairingCode) {
      ctx.reply(`📲 *Kode Pairing WhatsApp:*

\`\`\`
${pairingCode}
\`\`\``, {
        parse_mode: 'Markdown'
      })
    }

    if (connection === 'open') {
      ctx.reply('✅ WhatsApp berhasil terhubung!')
    } else if (connection === 'close') {
      ctx.reply('❌ Koneksi WhatsApp gagal atau ditutup.')
    }
  })

  sock.ev.on('creds.update', saveCreds)
})

bot.launch()