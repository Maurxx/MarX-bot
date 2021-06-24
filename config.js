module.exports = {
  Admins: ["UserID", "UserID"], //Admins of the bot
  DefaultPrefix: process.env.Prefix || ">", //Default prefix, Server Admins can change the prefix
  Port: 3000, //Which port website gonna be hosted
  SupportServer: "https://discord.gg/EeaemXa", //Support Server Link
  Token: process.env.Token || "ODU3NzE2MjQ0MDM0MzU1Mjgw.YNTogA.J-nb7XuChbxSyg1H1b1zPEXKZ08", //Discord Bot Token
  ClientID: process.env.Discord_ClientID || "857716244034355280", //Discord Client ID
  ClientSecret: process.env.Discord_ClientSecret || "33EVuDXyGKsEngDJ-zBdR_74OPTOC65M", //Discord Client Secret
  Scopes: ["identify", "guilds", "applications.commands"], //Discord OAuth2 Scopes
  CallbackURL: "/api/callback", //Discord OAuth2 Callback URL
  "24/7": true, //If you want the bot to be stay in the vc 24/7
  CookieSecret: "CVR", //A Secret like a password
  IconURL:
    "https://raw.githubusercontent.com/Maurxx/MarX-bot/master/assets/logo.gif", //URL of all embed author icons | Dont edit unless you dont need that Music CD Spining
  Permissions: 2205280576, //Bot Inviting Permissions
  Website: process.env.Website || "0.0.0.0", //Website where it was hosted at includes http or https || Use "0.0.0.0" if you using Heroku

  //Lavalink
Lavalink: {
  id: "Main",
  host: "goodgameservices.webhop.me", 
  port: 8888,
  pass: "GGS_IS_THE_BEST", 
},

  //SpotifyDev https://developer.spotify.com/dashboard/
  Spotify: {
    ClientID: process.env.Spotify_ClientID || "104395bff91e4368853f202db26bcee2", //Spotify Client ID
    ClientSecret: process.env.Spotify_ClientSecret || "cc8af293895448d49666a353dfd76982", //Spotify Client Secret
  },
};
