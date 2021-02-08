module.exports = {
    name: 'players',
    description: "Shows online players",
    async execute(message,bot,commandArgs){
        try{
            let messagePlayers;
            if (commandArgs === 'all'){
                let counter = 0;
                Object.values(bot.players).forEach(player => {
                    message.guild.channels.cache.find(ch => ch.name === 'krashr').send(player.username);
                    counter += 1;
                })
                message.guild.channels.cache.find(ch => ch.name === 'krashr').send(`[\`${counter}\` PLAYERS]`);
            } else {
                async function loadNames(players){
                    let player = players.shift();
                    if (!player){
                        embedPlayers.color = 0x00ff00;
                        messagePlayers.edit({embed: embedPlayers});
                        return
                    }
                    playerCount += 1;
                    embedPlayers.title = `[ONLINE PLAYERS]: ${playerCount}`;
                    if (playerCount % 24 === 0){
                        embedPlayers.color = 0x00ff00;
                        await messagePlayers.edit(({embed: embedPlayers}));
                        embedPlayers.color = 0x0089eb;
                        embedPlayers.fields = [{
                            name: player.username,
                            value: '\u200b',
                            inline: true,
                        }];
                        newMessage = new Promise(async (resolve,reject)=>{
                            let temp = await message.guild.channels.cache.find(ch => ch.name === 'krashr').send({ embed: embedPlayers })
                            resolve(temp)
                        })
                        newMessage.then((newmsg)=>{
                            messagePlayers = newmsg;
                            loadNames(players)
                        })
                    } else {
                        embedPlayers.fields.push({
                            name: player.username,
                            value: '\u200b',
                            inline: true,
                        });
                        messagePlayers.edit({embed: embedPlayers}).then(()=>{
                            loadNames(players)
                        });
                    }
                }
                const embedPlayers = {
                    color: 0x0089eb,
                    title: `[ONLINE PLAYERS]: 0`,
                    author: {
                        name: message.author.username,
                        icon_url: message.author.avatarURL(),
                    },
                    fields: [],
                    timestamp: new Date(),
                    footer: {
                        text: message.guild.name,
                        icon_url: message.guild.iconURL(),
                    },
                };
                let playerCount = 0;
                messagePlayers = await message.guild.channels.cache.find(ch => ch.name === 'krashr').send({ embed: embedPlayers })
                const players = Object.values(bot.players)
                loadNames(players)
            }
        } catch(e){
            console.trace(e)
            message.guild.channels.cache.find(ch => ch.name === 'krashr').send(`[UNKNOWN ERROR]`)
        }
    }
}