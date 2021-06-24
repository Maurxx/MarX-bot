const { MessageEmbed } = require("discord.js");

module.exports = {
  name: "clear",
  description: "Limpia la lista de canciones.",
  usage: "",
  permissions: {
    channel: ["VIEW_CHANNEL", "SEND_MESSAGES", "EMBED_LINKS"],
    member: [],
  },
  aliases: ["cl", "cls", "limpiar"],
  /**
   *
   * @param {import("../structures/DiscordMusicBot")} client
   * @param {import("discord.js").Message} message
   * @param {string[]} args
   * @param {*} param3
   */
  run: async (client, message, args, { GuildDB }) => {
    let player = await client.Manager.get(message.guild.id);
    if (!player)
      return client.sendTime(
        message.channel,
        "❌ | **Nada se está reproduciendo ahora mismo...**"
      );

    if (!player.queue || !player.queue.length || player.queue.length === 0)
      return client.sendTime(message.channel, "❌ | **Nada se está reproduciendo ahora mismo...**");
      if (!message.member.voice.channel) return client.sendTime(message.channel, "❌ | **¡Debes de estar en un canal de voz para reproducir algo!**");
      if (message.guild.me.voice.channel && message.member.voice.channel.id !== message.guild.me.voice.channel.id) return client.sendTime(message.channel, ":x: | **¡Debes de estar en el mismo canal de voz que yo para usar este comando!**");
    player.queue.clear();
    await client.sendTime(message.channel, "✅ | **¡Cola despejada!**");
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
      if (!member.voice.channel) return client.sendTime(interaction, "❌ | Debes de estar en un canal de voz para usar este comando.");
      if (guild.me.voice.channel && !guild.me.voice.channel.equals(member.voice.channel)) return client.sendTime(interaction, ":x: | **¡Debes de estar en el mismo canal de voz que yo para usar este comando!**");
      let player = await client.Manager.get(interaction.guild_id);
      if (!player)
        return client.sendTime(interaction, "❌ | **Nada se está reproduciendo ahora mismo...**");

      if (!player.queue || !player.queue.length || player.queue.length === 0)
        return client.sendTime(interaction, "❌ | **Nada se está reproduciendo ahora mismo...**");
      player.queue.clear();
      await client.sendTime(interaction, "✅ | **¡Cola despejada!**");
    },
  },
};
