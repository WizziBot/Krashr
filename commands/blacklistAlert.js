module.exports = {
    name: 'blacklistAlert',
    description: "Toggles all bots to detect blacklisted players online",
    execute(message,blacklistAlert,commandArgs,krashr){
        try{
            const range = commandArgs
            if (!range){
                message.channel.send(`[ERROR] Try using a valid syntax \`-blacklistAlert [maxrange/off]\``)
                return
            }
            if(blacklistAlert.do === true && range === 'off'){
                blacklistAlert.do = false;
                blacklistAlert.range = null;
                const embed = {
                    color: 0xff0000,
                    title: `[ID:ALL] [BLACKLIST DETECTION] : [OFF]`,
                    author: {
                        name: message.author.username,
                        icon_url: message.author.avatarURL(),
                    },
                    timestamp: new Date(),
                    footer: {
                        text: message.guild.name,
                        icon_url: message.guild.iconURL(),
                    },
                };
                message.guild.channels.cache.find(ch => ch.name === krashr.commandChannel).send({embed: embed})
                console.log(`[ID:ALL] [BLACKLIST DETECTION] : [OFF]`)
            } else if(blacklistAlert.do === false){
                blacklistAlert.do = true;
                blacklistAlert.range = parseInt(range);
                const embed = {
                    color: 0x00ff00,
                    title: `[ID:ALL] [BLACKLIST DETECTION] : [ON]`,
                    author: {
                        name: message.author.username,
                        icon_url: message.author.avatarURL(),
                    },
                    timestamp: new Date(),
                    footer: {
                        text: message.guild.name,
                        icon_url: message.guild.iconURL(),
                    },
                };
                message.guild.channels.cache.find(ch => ch.name === krashr.commandChannel).send({embed: embed})
                console.log(`[ID:ALL] [BLACKLIST DETECTION] : [ON]`)
            }
            return blacklistAlert;
        } catch(e){
            console.trace(e)
            message.channel.send(`[ERROR] Try using a valid syntax \`-blacklistAlert [maxrange/off]\``)
        }
    }
}