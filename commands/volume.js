const { MessageEmbed } = require("discord.js");
const { TrackUtils } = require("erela.js");

module.exports = {
    name: "volume",
    description: "Changes the Volume",
    usage: "<volume>",
    permissions: {
        channel: ["VIEW_CHANNEL", "SEND_MESSAGES", "EMBED_LINKS"],
        member: [],
    },
    aliases: ["vol", "v", "volumen"],
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
        if (!parseInt(args[0])) return client.sendTime(message.channel, `**Elige un número del** \`1 - 100\``);
        let vol = parseInt(args[0]);
        player.setVolume(vol);
        client.sendTime(message.channel, `🔉 | **Volumen puesto a** \`${player.volume}\``);
    },
    SlashCommand: {
        options: [
            {
                name: "number",
                value: "number 1 - 100",
                type: 4,
                required: true,
                description: "What do you want to change the volume to?",
            },
        ],
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

            if (!member.voice.channel) return client.sendTime(interaction, "❌ | Debes estar en un canal de voz para usar este comando!");
            if (guild.me.voice.channel && !guild.me.voice.channel.equals(member.voice.channel)) return client.sendTime(interaction, ":x: | **Debes estar en el mismo canal de voz que yo para usar este comando!**");
            let player = await client.Manager.get(interaction.guild_id);
            if (!player) return client.sendTime(interaction, "❌ | **Nada se está reproduciendo ahora mismo...**");
            if (!args.length) return client.sendTime(interaction, `🔉 | El volumen actual es \`${player.volume}\`.`);
            let vol = parseInt(args[0].value);
            if (!vol || vol < 1 || vol > 100) return client.sendTime(interaction, `**Elige un número del** \`1 - 100\``);
            player.setVolume(vol);
            client.sendTime(interaction, `🔉 | Volumen puesto a \`${player.volume}\``);
        },
    },
};
