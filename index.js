require('dotenv').config()

const OpenAI = require('openai')
const TelegramBot = require('node-telegram-bot-api');

const openai = new OpenAI({
    // baseURL: 'https://api.proxyapi.ru/openai/v1',
    apiKey: process.env.TEST,
});


const token = process.env.TELEGRAM_TOKEN;

const bot = new TelegramBot(token, {polling: true});

bot.on('text', async msg => {
    const text = msg.text
    const chatId = msg.chat.id
    const messageId = msg.message_id

    const msgWait = await bot.sendMessage(msg.chat.id, `Генерирую ответ...`);

    const chatCompletion = await openai.chat.completions.create({
        messages: [{ role: 'user', content: text }],
        model: 'gpt-3.5-turbo',
    });

    await bot.deleteMessage(msgWait.chat.id, msgWait.message_id);
    bot.sendMessage(chatId,chatCompletion.choices[0].message.content,{reply_to_message_id: messageId})
})