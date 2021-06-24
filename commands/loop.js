const { MessageEmbed } = require("discord.js");
const { TrackUtils } = require("erela.js");

module.exports = {
    name: "loop",
    description: "Pone en bucle la canción que se está reproduciendo.",
    usage: "",
    permissions: {
      channel: ["VIEW_CHANNEL", "SEND_MESSAGES", "EMBED_LINKS"],
      member: [],
    },
    aliases: ["repeat", "repetir", "bucle", "bu"],
    /**
      *
      * @param {import("../structures/DiscordMusicBot")} client
      * @param {import("discord.js").Message} message
      * @param {string[]} args
      * @param {*} param3
      */
    run: async (client, message, args, { GuildDB }) => {
      let player = await client.Manager.get(message.guild.id);
      if (!player) return client.sendTime(message.channel, "❌ | **Nada se está reproduciendo ahora mismo...**");
      if (!message.member.voice.channel) return client.sendTime(message.channel, "❌ | **Debes estar en un canal de voz para usar este comando!**");
      if (message.guild.me.voice.channel && message.member.voice.channel.id !== message.guild.me.voice.channel.id) return client.sendTime(message.channel, ":x: | **Debes estar en el mismo canal de voz que yo para usar este comando!**");

        if (player.trackRepeat) {
          player.setTrackRepeat(false)
          client.sendTime(message.channel, `El bucle se ha desactivado.`);
        } else {
          player.setTrackRepeat(true)
          client.sendTime(message.channel, `El bucle se ha activado.`);
        }
    },
    SlashCommand: {
       /**
       *
       * @param {import("../structures/DiscordMusicBot")} client
       * @param {import("discord.js").Message} message
       * @param {string[]} args
       * @param {*} param3
       */
        run: async (client, interaction, args, { GuildDB }) => {
          const guild = client.guilds.cache.get(interaction.guild_id);
          const member = guild.members.cache.get(interaction.member.user.id);
          const voiceChannel = member.voice.channel;
          let player = await client.Manager.get(interaction.guild_id);
          if (!player) return client.sendTime(interaction, "❌ | **Nada se está reproduciendo ahora mismo...**"); 
          if (!member.voice.channel) return client.sendTime(interaction, "❌ | Debes estar en un canal de voz para usar este comando!");
          if (guild.me.voice.channel && !guild.me.voice.channel.equals(member.voice.channel)) return client.sendTime(interaction, ":x: | **Debes estar en el mismo canal de voz que yo para usar este comando!**");

            if(player.trackRepeat){
                  player.setTrackRepeat(false)
                  client.sendTime(interaction, `El bucle se ha desactivado.`);
              }else{
                  player.setTrackRepeat(true)
                  client.sendTime(interaction, `El bucle se ha activado.`);
              }
          console.log(interaction.data)
        }
      }    
};