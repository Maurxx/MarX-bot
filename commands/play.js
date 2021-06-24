const { Util, MessageEmbed } = require("discord.js");
const { TrackUtils, Player } = require("erela.js");
const prettyMilliseconds = require("pretty-ms");

module.exports = {
    name: "play",
    description: "Reproduce tus canciones favoritas.",
    usage: "[query]",
    permissions: {
        channel: ["VIEW_CHANNEL", "SEND_MESSAGES", "EMBED_LINKS"],
        member: [],
    },
    aliases: ["p"],
    /**
     *
     * @param {import("../structures/DiscordMusicBot")} client
     * @param {import("discord.js").Message} message
     * @param {string[]} args
     * @param {*} param3
     */
    run: async (client, message, args, { GuildDB }) => {
        if (!message.member.voice.channel) return client.sendTime(message.channel, "❌ | **Debes estar en un canal de voz para usar este comando!**");
        if (message.guild.me.voice.channel && message.member.voice.channel.id !== message.guild.me.voice.channel.id) return client.sendTime(message.channel, ":x: | **Debes estar en el mismo canal de voz que yo para usar este comando!**");
        let SearchString = args.join(" ");
        if (!SearchString) return client.sendTime(message.channel, `**El uso correcto de este cmd es - **\`${GuildDB.prefix}play [canción]\``);
        let CheckNode = client.Manager.nodes.get(client.config.Lavalink.id);
        let Searching = await message.channel.send(":mag_right: Buscando...");
        if (!CheckNode || !CheckNode.connected) {
       return client.sendTime(message.channel,"❌ | **Nodo de Lavalink no conectado.**");
        }
        const player = client.Manager.create({
            guild: message.guild.id,
            voiceChannel: message.member.voice.channel.id,
            textChannel: message.channel.id,
            selfDeafen: false,
        });

        let SongAddedEmbed = new MessageEmbed().setColor("RANDOM");

        if (!player) return client.sendTime(message.channel, "❌ | **Nada se está reproduciendo ahora mismo...**");

        if (player.state != "CONNECTED") await player.connect();

        try {
            if (SearchString.match(client.Lavasfy.spotifyPattern)) {
                await client.Lavasfy.requestToken();
                let node = client.Lavasfy.nodes.get(client.config.Lavalink.id);
                let Searched = await node.load(SearchString);

                if (Searched.loadType === "PLAYLIST_LOADED") {
                    let songs = [];
                    for (let i = 0; i < Searched.tracks.length; i++) songs.push(TrackUtils.build(Searched.tracks[i], message.author));
                    player.queue.add(songs);
                    if (!player.playing && !player.paused && player.queue.totalSize === Searched.tracks.length) player.play();
                    SongAddedEmbed.setAuthor(`Playlist añadida a la lista`, message.author.displayAvatarURL());
                    SongAddedEmbed.addField("Se han puesto en la lista", `\`${Searched.tracks.length}\` canciones.`, false);
                    //SongAddedEmbed.addField("Playlist duration", `\`${prettyMilliseconds(Searched.tracks, { colonNotation: true })}\``, false)
                    Searching.edit(SongAddedEmbed);
                } else if (Searched.loadType.startsWith("TRACK")) {
                    player.queue.add(TrackUtils.build(Searched.tracks[0], message.author));
                    if (!player.playing && !player.paused && !player.queue.size) player.play();
                    SongAddedEmbed.setAuthor(`Añadida a la lista`, client.config.IconURL);
                    SongAddedEmbed.setDescription(`[${Searched.tracks[0].info.title}](${Searched.tracks[0].info.uri})`);
                    SongAddedEmbed.addField("Autor", Searched.tracks[0].info.author, true);
                    //SongAddedEmbed.addField("Duration", `\`${prettyMilliseconds(Searched.tracks[0].length, { colonNotation: true })}\``, true);
                    if (player.queue.totalSize > 1) SongAddedEmbed.addField("Posición en lista", `${player.queue.size - 0}`, true);
                    Searching.edit(SongAddedEmbed);
                } else {
                    return client.sendTime(message.channel, "**No se encontraron resultados para - **" + SearchString);
                }
            } else {
                let Searched = await player.search(SearchString, message.author);
                if (!player) return client.sendTime(message.channel, "❌ | **Nada se está reproduciendo ahora mismo...**");

                if (Searched.loadType === "NO_MATCHES") return client.sendTime(message.channel, "**No se encontraron resultados para - **" + SearchString);
                else if (Searched.loadType == "PLAYLIST_LOADED") {
                    player.queue.add(Searched.tracks);
                    if (!player.playing && !player.paused && player.queue.totalSize === Searched.tracks.length) player.play();
                    SongAddedEmbed.setAuthor(`Playlist añadida a la lista`, client.config.IconURL);
                    SongAddedEmbed.setThumbnail(Searched.tracks[0].displayThumbnail());
                    SongAddedEmbed.setDescription(`[${Searched.playlist.name}](${SearchString})`);
                    SongAddedEmbed.addField("Se han puesto en la lista", `\`${Searched.tracks.length}\` canciones`, false);
                    SongAddedEmbed.addField("Duración de la Playlist", `\`${prettyMilliseconds(Searched.playlist.duration, { colonNotation: true })}\``, false);
                    Searching.edit(SongAddedEmbed);
                } else {
                    player.queue.add(Searched.tracks[0]);
                    if (!player.playing && !player.paused && !player.queue.size) player.play();
                    SongAddedEmbed.setAuthor(`Añadida a la lista`, client.config.IconURL);

                    SongAddedEmbed.setThumbnail(Searched.tracks[0].displayThumbnail());
                    SongAddedEmbed.setDescription(`[${Searched.tracks[0].title}](${Searched.tracks[0].uri})`);
                    SongAddedEmbed.addField("Autor", Searched.tracks[0].author, true);
                    SongAddedEmbed.addField("Duración", `\`${prettyMilliseconds(Searched.tracks[0].duration, { colonNotation: true })}\``, true);
                    if (player.queue.totalSize > 1) SongAddedEmbed.addField("Posición en lista", `${player.queue.size - 0}`, true);
                    Searching.edit(SongAddedEmbed);
                }
            }
        } catch (e) {
            console.log(e);
            return client.sendTime(message.channel, "**No se encontraron resultados para - **" + SearchString);
        }
    },

    SlashCommand: {
        options: [
            {
                name: "query",
                value: "query",
                type: 3,
                required: true,
                description: "Reproduce música en el canal de voz.",
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
            const voiceChannel = member.voice.channel;
            let awaitchannel = client.channels.cache.get(interaction.channel_id); /// thanks Reyansh for this idea ;-;
            if (!member.voice.channel) return client.sendTime(interaction, "❌ | **Debes estar en un canal de voz para usar este comando!**");
            if (guild.me.voice.channel && !guild.me.voice.channel.equals(member.voice.channel)) return client.sendTime(interaction, ":x: | **Debes estar en el mismo canal de voz que yo para usar este comando!**");
            let CheckNode = client.Manager.nodes.get(client.config.Lavalink.id);
            if (!CheckNode || !CheckNode.connected) {
              return client.sendTime(interaction,"❌ | **Nodo de Lavalink no conectado.**");
            }
    
            let player = client.Manager.create({
                guild: interaction.guild_id,
                voiceChannel: voiceChannel.id,
                textChannel: interaction.channel_id,
                selfDeafen: false,
            });
            if (player.state != "CONNECTED") await player.connect();
            let search = interaction.data.options[0].value;
            let res;

            if (search.match(client.Lavasfy.spotifyPattern)) {
                await client.Lavasfy.requestToken();
                let node = client.Lavasfy.nodes.get(client.config.Lavalink.id);
                let Searched = await node.load(search);

                switch (Searched.loadType) {
                    case "LOAD_FAILED":
                        if (!player.queue.current) player.destroy();
                        return client.sendError(interaction, `❌ | **Ocurrió un error durante la búsqueda.**`);

                    case "NO_MATCHES":
                        if (!player.queue.current) player.destroy();
                        return client.sendTime(interaction, "❌ | **No se encontraron resultados.**");
                    case "TRACK_LOADED":
                        player.queue.add(TrackUtils.build(Searched.tracks[0], member.user));
                        if (!player.playing && !player.paused && !player.queue.length) player.play();
                        let SongAddedEmbed = new MessageEmbed();
                            SongAddedEmbed.setAuthor(`Añadida a la lista.`, client.config.IconURL);
                            SongAddedEmbed.setColor("RANDOM");
                            SongAddedEmbed.setDescription(`[${Searched.tracks[0].info.title}](${Searched.tracks[0].info.uri})`);
                            SongAddedEmbed.addField("Autor", Searched.tracks[0].info.author, true);
                            if (player.queue.totalSize > 1) SongAddedEmbed.addField("Posición en lista", `${player.queue.size - 0}`, true);
                            return interaction.send(SongAddedEmbed);

                    case "SEARCH_RESULT":
                        player.queue.add(TrackUtils.build(Searched.tracks[0], member.user));
                        if (!player.playing && !player.paused && !player.queue.length) player.play();
                        let SongAdded = new MessageEmbed();
                            SongAdded.setAuthor(`Añadida a la lista`, client.config.IconURL);
                            SongAdded.setColor("RANDOM");
                            SongAdded.setDescription(`[${Searched.tracks[0].info.title}](${Searched.tracks[0].info.uri})`);
                            SongAdded.addField("Autor", Searched.tracks[0].info.author, true);
                            if (player.queue.totalSize > 1) SongAdded.addField("Posición en lista", `${player.queue.size - 0}`, true);
                            return interaction.send(SongAdded);


                    case "PLAYLIST_LOADED":
                        let songs = [];
                        for (let i = 0; i < Searched.tracks.length; i++) songs.push(TrackUtils.build(Searched.tracks[i], member.user));
                        player.queue.add(songs);
                        if (!player.playing && !player.paused && player.queue.totalSize === Searched.tracks.length) player.play();
                        let Playlist = new MessageEmbed();
                        Playlist.setAuthor(`Playlist añadida a la lista`, client.config.IconURL);
                        Playlist.setDescription(`[${Searched.playlistInfo.name}](${interaction.data.options[0].value})`);
                        Playlist.addField("Se han puesto en la lista", `\`${Searched.tracks.length}\` canciones`, false);
                        return interaction.send(Playlist);
                }
            } else {
                try {
                    res = await player.search(search, member.user);
                    if (res.loadType === "LOAD_FAILED") {
                        if (!player.queue.current) player.destroy();
                        return client.sendError(interaction, `:x: | **Ocurrió un error durante la búsqueda.**`);
                    }
                } catch (err) {
                    return client.sendError(interaction, `Ocurrió un error durante la búsqueda.: ${err.message}`);
                }
                switch (res.loadType) {
                    case "NO_MATCHES":
                        if (!player.queue.current) player.destroy();
                        return client.sendTime(interaction, "❌ | **No se encontraron resultados.**");
                    case "TRACK_LOADED":
                        player.queue.add(res.tracks[0]);
                        if (!player.playing && !player.paused && !player.queue.length) player.play();
                        let SongAddedEmbed = new MessageEmbed();
                            SongAddedEmbed.setAuthor(`Añadida a la lista`, client.config.IconURL);
                            SongAddedEmbed.setThumbnail(res.tracks[0].displayThumbnail());
                            SongAddedEmbed.setColor("RANDOM");
                            SongAddedEmbed.setDescription(`[${res.tracks[0].title}](${res.tracks[0].uri})`);
                            SongAddedEmbed.addField("Autor", res.tracks[0].author, true);
                            SongAddedEmbed.addField("Duración", `\`${prettyMilliseconds(res.tracks[0].duration, { colonNotation: true })}\``, true);
                            if (player.queue.totalSize > 1) SongAddedEmbed.addField("Posición en lista", `${player.queue.size - 0}`, true);
                            return interaction.send(SongAddedEmbed);
                            
                    case "PLAYLIST_LOADED":
                        player.queue.add(res.tracks);
                        await player.play();
                        let SongAdded = new MessageEmbed();
                        SongAdded.setAuthor(`Playlist añadida a la lista`, client.config.IconURL);
                        SongAdded.setThumbnail(res.tracks[0].displayThumbnail());
                        SongAdded.setDescription(`[${res.playlist.name}](${interaction.data.options[0].value})`);
                        SongAdded.addField("Se han puesto en la lista", `\`${res.tracks.length}\` canciones`, false);
                        SongAdded.addField("Duración de la playlist", `\`${prettyMilliseconds(res.playlist.duration, { colonNotation: true })}\``, false);
                        return interaction.send(SongAdded);
                    case "SEARCH_RESULT":
                        const track = res.tracks[0];
                        player.queue.add(track);
                    

                        if (!player.playing && !player.paused && !player.queue.length) {
                            let SongAddedEmbed = new MessageEmbed();
                            SongAddedEmbed.setAuthor(`Añadida a la lista`, client.config.IconURL);
                            SongAddedEmbed.setThumbnail(track.displayThumbnail());
                            SongAddedEmbed.setColor("RANDOM");
                            SongAddedEmbed.setDescription(`[${track.title}](${track.uri})`);
                            SongAddedEmbed.addField("Autor", track.author, true);
                            SongAddedEmbed.addField("Duración", `\`${prettyMilliseconds(track.duration, { colonNotation: true })}\``, true);
                            if (player.queue.totalSize > 1) SongAddedEmbed.addField("Posición en lista", `${player.queue.size - 0}`, true);
                            player.play();
                            return interaction.send(SongAddedEmbed);
                            
                        } else {
                            let SongAddedEmbed = new MessageEmbed();
                            SongAddedEmbed.setAuthor(`Añadida a la lista`, client.config.IconURL);
                            SongAddedEmbed.setThumbnail(track.displayThumbnail());
                            SongAddedEmbed.setColor("RANDOM");
                            SongAddedEmbed.setDescription(`[${track.title}](${track.uri})`);
                            SongAddedEmbed.addField("Autor", track.author, true);
                            SongAddedEmbed.addField("Duración", `\`${prettyMilliseconds(track.duration, { colonNotation: true })}\``, true);
                            if (player.queue.totalSize > 1) SongAddedEmbed.addField("Posición en lista", `${player.queue.size - 0}`, true);
                            interaction.send(SongAddedEmbed);
                        }
                }
            }
        },
    },
};
