const fs = require('fs-extra');
const { Sequelize } = require('sequelize');
if (fs.existsSync('set.env'))
    require('dotenv').config({ path: __dirname + '/set.env' });
const path = require("path");
const databasePath = path.join(__dirname, './database.db');
const DATABASE_URL = process.env.DATABASE_URL === undefined
    ? databasePath
    : process.env.DATABASE_URL;
module.exports = { session: process.env.SESSION_ID || 'eyJub2lzZUtleSI6eyJwcml2YXRlIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoiNEVSVWZxMm9yZXRiYjV5YWVjeDRrN2k4bkEweUVQeTlqcE1KRm1wTW9HTT0ifSwicHVibGljIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoiWDdzeExDc21ramVKM3VselAvZ3dPUjIyT1hlaWs5UnhPdS9WRHZTTG9Gaz0ifX0sInBhaXJpbmdFcGhlbWVyYWxLZXlQYWlyIjp7InByaXZhdGUiOnsidHlwZSI6IkJ1ZmZlciIsImRhdGEiOiJtT1hhQmNqU01xRTRXaHV1cmtpYW03cGxRTC9iMDBUSkIyN1hKSTRwdkc0PSJ9LCJwdWJsaWMiOnsidHlwZSI6IkJ1ZmZlciIsImRhdGEiOiI3RFBCcW9Ua3JLTDNHNEFpcUlrV1NEV3JTaGtZQWdxYTBLMXBjZkQxeVYwPSJ9fSwic2lnbmVkSWRlbnRpdHlLZXkiOnsicHJpdmF0ZSI6eyJ0eXBlIjoiQnVmZmVyIiwiZGF0YSI6IkFNcklzYVExTHF6Wnl0b21ac1dOVEZFeTZkL0hHbFp2WW54bE5GOEFVRUE9In0sInB1YmxpYyI6eyJ0eXBlIjoiQnVmZmVyIiwiZGF0YSI6ImRyTXR2enZicVJ5dW5IUHFKYUVFSzh6MW55VTdBU0lhRG5GRU04V0FJVVU9In19LCJzaWduZWRQcmVLZXkiOnsia2V5UGFpciI6eyJwcml2YXRlIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoiV0t5RDhvY1NzQzB4MC9VQk43Rmp6VHV4TkdVWUQ0ODBRUXFWdmxMdzJFbz0ifSwicHVibGljIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoieWJuWTQ0N01RcktONE1UdWVtYnR5bEl6SFRiTVdrOW1SMDZUbzc2TkNBUT0ifX0sInNpZ25hdHVyZSI6eyJ0eXBlIjoiQnVmZmVyIiwiZGF0YSI6ImtpSnVXc0N3TnRSQlZwZm1VY3ZDZ0pVb2h3ZDdsUjZDTzNhTkp1end6WkdFME5ZM2pNUkZQNUt2dXdUaGE4aThCS0c0V3JDQ0FiOW13WGp5UksyREF3PT0ifSwia2V5SWQiOjF9LCJyZWdpc3RyYXRpb25JZCI6MjI5LCJhZHZTZWNyZXRLZXkiOiJQWmlCRTNWQ3JFMjV0WXQzdy9IRXNXUnhnRmpMdXN1NllqbitzTktVZWEwPSIsInByb2Nlc3NlZEhpc3RvcnlNZXNzYWdlcyI6W10sIm5leHRQcmVLZXlJZCI6MzEsImZpcnN0VW51cGxvYWRlZFByZUtleUlkIjozMSwiYWNjb3VudFN5bmNDb3VudGVyIjowLCJhY2NvdW50U2V0dGluZ3MiOnsidW5hcmNoaXZlQ2hhdHMiOmZhbHNlfSwiZGV2aWNlSWQiOiJuWVNYMkdSWFE4S2pKQmFNaGxvc25RIiwicGhvbmVJZCI6ImQxNmEwMzk0LWQ3ZmYtNGEzMS1hY2Y4LWU5YTQ0MTQ5ZTk4MiIsImlkZW50aXR5SWQiOnsidHlwZSI6IkJ1ZmZlciIsImRhdGEiOiJIckxQZVY0cjRqU2xNK1BITFZZWHM5c2RvTlk9In0sInJlZ2lzdGVyZWQiOnRydWUsImJhY2t1cFRva2VuIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoickphZzk4ZmhlRmtCS3NBbG5pZzl0TWhROVRzPSJ9LCJyZWdpc3RyYXRpb24iOnt9LCJwYWlyaW5nQ29kZSI6Ik5aWjRKTEI2IiwibWUiOnsiaWQiOiIyNTQ3NTkwOTA5NDU6NkBzLndoYXRzYXBwLm5ldCJ9LCJhY2NvdW50Ijp7ImRldGFpbHMiOiJDUFBocldJUTVOK2Z1QVlZQWlBQUtBQT0iLCJhY2NvdW50U2lnbmF0dXJlS2V5IjoibkJhNWgzUHpyV3BaMXBFYVJienZGS1NjUTlibjNFRXdsUkZFdm1mSDNVND0iLCJhY2NvdW50U2lnbmF0dXJlIjoiTTBrNXRJMVgreDQvNEdoQVR4TzNtbXB0T3VaSHF2QkdQSVNVY3FTdTZTQXozVkZaNXpxNE1KSWpCNmwzMVpvM09FOTlRV1ZBNm5ZY016dllDeWgrQ2c9PSIsImRldmljZVNpZ25hdHVyZSI6IlhVcDZyRTZaR3dPY25lRE5TdlRYS2RiL1VpK1hSalVJOXp1a0RZRFdZbVA2dkFLMTZnTWV2N1lvdFFRSFN1ZnRRRGpHdGVUam10WkpjM1JkYVlVa0RBPT0ifSwic2lnbmFsSWRlbnRpdGllcyI6W3siaWRlbnRpZmllciI6eyJuYW1lIjoiMjU0NzU5MDkwOTQ1OjZAcy53aGF0c2FwcC5uZXQiLCJkZXZpY2VJZCI6MH0sImlkZW50aWZpZXJLZXkiOnsidHlwZSI6IkJ1ZmZlciIsImRhdGEiOiJCWndXdVlkejg2MXFXZGFSR2tXODd4U2tuRVBXNTl4Qk1KVVJSTDVueDkxTyJ9fV0sInBsYXRmb3JtIjoiYW5kcm9pZCIsImxhc3RBY2NvdW50U3luY1RpbWVzdGFtcCI6MTcyODU3MzQyNn0=',
    PREFIXE: process.env.PREFIX || "+",
    OWNER_NAME: process.env.OWNER_NAME || "Dulla",
    NUMERO_OWNER : process.env.NUMERO_OWNER || "254759090945",              
    AUTO_READ_STATUS: process.env.AUTO_READ_STATUS || "non",
    AUTO_DOWNLOAD_STATUS: process.env.AUTO_DOWNLOAD_STATUS || 'non',
    BOT : process.env.BOT_NAME || 'Dulla Md ',
    URL : process.env.BOT_MENU_LINKS || 'https://telegra.ph/file/dcaaa16f7b556d84093f7.jpg,https://telegra.ph/file/de85851cc494331f47b3f.jpg,https://telegra.ph/file/f0f8ef25b35b76be901a7.jpg',
    MODE: process.env.PUBLIC_MODE || "no",
    PM_PERMIT: process.env.PM_PERMIT || 'no',
    HEROKU_APP_NAME : process.env.HEROKU_APP_NAME,
    HEROKU_APY_KEY : process.env.HEROKU_APY_KEY ,
    WARN_COUNT : process.env.WARN_COUNT || '3' ,
    ETAT : process.env.PRESENCE || '',
    CHATBOT : process.env.PM_CHATBOT || 'no',
    DP : process.env.STARTING_BOT_MESSAGE || "yes",
    ADM : process.env.ANTI_DELETE_MESSAGE || 'yes',
    DATABASE_URL,
    DATABASE: DATABASE_URL === databasePath
        ? "postgres://db_7xp9_user:6hwmTN7rGPNsjlBEHyX49CXwrG7cDeYi@dpg-cj7ldu5jeehc73b2p7g0-a.oregon-postgres.render.com/db_7xp9" : "postgres://db_7xp9_user:6hwmTN7rGPNsjlBEHyX49CXwrG7cDeYi@dpg-cj7ldu5jeehc73b2p7g0-a.oregon-postgres.render.com/db_7xp9",
    /* new Sequelize({
     dialect: 'sqlite',
     storage: DATABASE_URL,
     logging: false,
})
: new Sequelize(DATABASE_URL, {
     dialect: 'postgres',
     ssl: true,
     protocol: 'postgres',
     dialectOptions: {
         native: true,
         ssl: { require: true, rejectUnauthorized: false },
     },
     logging: false,
}),*/
};
let fichier = require.resolve(__filename);
fs.watchFile(fichier, () => {
    fs.unwatchFile(fichier);
    console.log(`mise à jour ${__filename}`);
    delete require.cache[fichier];
    require(fichier);
});
