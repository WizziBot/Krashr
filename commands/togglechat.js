module.exports = {
    name: 'togglechat',
    description: "Toggles the minecraft chat",
    execute(message,chatOn,krashr){
        try{
            if(chatOn === false){
                chatOn = true;
                const embed = {
                    color: 0x00ff00,
                    title: `[ID:0] [MINECRAFT CHAT] : [ON]`,
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
                console.log('[ID:0] [MINECRAFT CHAT] : [ON]')
            } else if(chatOn === true){
                chatOn = false;
                const embed = {
                    color: 0xff0000,
                    title: `[ID:0] [MINECRAFT CHAT] : [OFF]`,
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
                console.log('[ID:0] [MINECRAFT CHAT] : [OFF]')
            }
            return chatOn;
        } catch(e){
            console.trace(e)
            message.guild.channels.cache.find(ch => ch.name === krashr.commandChannel).send(`[UNKNOWN ERROR]`)
        }
    }
}