const { MessageEmbed } = require("discord.js");
const { TrackUtils } = require("erela.js");

module.exports = {
    name: "seek",
    description: "Adelanta a una posición en la canción.",
    usage: "<time s/m/h>",
    permissions: {
        channel: ["VIEW_CHANNEL", "SEND_MESSAGES", "EMBED_LINKS"],
        member: [],
    },
    aliases: ["forward", "adelantar"],
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
        if (!player.queue.current.isSeekable) return client.sendTime(message.channel, "❌ | **No estoy habilitado para adelantar esta canción!**");
        let SeekTo = client.ParseHumanTime(args.join(" "));
        if (!SeekTo) return client.sendTime(message.channel, `**Usa - **\`${GuildDB.prefix}seek <número s/m/h>\` \n**Ejemplo - **\`${GuildDB.prefix}seek 2m 10s\``);
        player.seek(SeekTo * 1000);
        message.react("✅");
    },

    SlashCommand: {
        options: [
            {
                name: "time",
                description: "Seek to any part of a song",
                value: "time",
                type: 3,
                required: true,
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
                    let player = await client.Manager.get(interaction.guild_id);
                    
                    if (!member.voice.channel) return client.sendTime(interaction, "❌ | **Debes estar en un canal de voz para usar este comando!**");
                    if (guild.me.voice.channel && !guild.me.voice.channel.equals(member.voice.channel)) return client.sendTime(interaction, ":x: | **Debes estar en el mismo canal de voz que yo para usar este comando!**");

                    if (!player) return client.sendTime(interaction, "❌ | **Nada se está reproduciendo ahora mismo...**");
                    if (!player.queue.current.isSeekable) return client.sendTime(interaction, "❌ | **No estoy habilitado para adelantar esta canción!**");
                    let SeekTo = client.ParseHumanTime(interaction.data.options[0].value);
                    if (!SeekTo) return client.sendTime(interaction, `**Usa - **\`${GuildDB.prefix}seek <número s/m/h>\` \n**Ejemplo -** \`${GuildDB.prefix}seek 2m 10s\``);
                    player.seek(SeekTo * 1000);
                    client.sendTime(interaction, "✅ | **La canción se ha adelantado exitosamente a **", `\`${Seekto}\``);
                },
            },
        ],
    },
};

