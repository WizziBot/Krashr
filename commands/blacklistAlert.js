module.exports = {
    name: 'blacklistAlert',
    description: "Toggles all bots to detect blacklisted players online",
    execute(message,blacklistAlert,krashr){
        try{
            if(blacklistAlert.do === true){
                blacklistAlert.do = false;
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