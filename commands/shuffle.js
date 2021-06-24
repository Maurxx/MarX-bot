const { MessageEmbed } = require("discord.js");

module.exports = {
    name: "shuffle",
    description: "Activa reproducción aleatoria.",
    usage: "",
    permissions: {
        channel: ["VIEW_CHANNEL", "SEND_MESSAGES", "EMBED_LINKS"],
        member: [],
    },
    aliases: ["shuff", "mezclar", "mix"],
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
        if (!player.queue || !player.queue.length || player.queue.length === 0) return client.sendTime(interaction, "❌ | **No hay suficientes canciones en la lista para la reproducción aleatoria.**");
        player.queue.shuffle();
        await client.sendTime(message.channel, "✅ | Se ha mezclado la lista!");
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

            if (!member.voice.channel) return client.sendTime(interaction, "❌ | **Debes estar en un canal de voz para usar este comando!**");
            if (guild.me.voice.channel && !guild.me.voice.channel.equals(member.voice.channel)) return client.sendTime(interaction, ":x: | **Debes estar en el mismo canal de voz que yo para usar este comando!**");

            let player = await client.Manager.get(interaction.guild_id);
            if (!player) return client.sendTime(interaction.channel, "❌ | **Nada se está reproduciendo ahora mismo...**");
            if (!player.queue || !player.queue.length || player.queue.length === 0) return client.sendTime(interaction, "❌ | **No hay suficientes canciones en la lista para la reproducción aleatoria.**");
            player.queue.shuffle();
            client.sendTime(interaction, "✅ | Se ha mezclado la lista!");
        },
    },
};