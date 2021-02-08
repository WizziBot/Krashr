module.exports = {
    name: 'lookAtPlayer',
    description: "Looks at the player",
    execute(message,lookAtPlayer){
        try{
            if(lookAtPlayer === false){
                lookAtPlayer = true;
                const embed = {
                    color: 0x00ff00,
                    title: `[LOOK AT PLAYER] : [ON]`,
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
                message.guild.channels.cache.find(ch => ch.name === 'krashr').send({embed: embed})
                console.log('[LOOK AT PLAYER] : [ON]')
            } else if(lookAtPlayer === true){
                lookAtPlayer = false;
                const embed = {
                    color: 0xff0000,
                    title: `[LOOK AT PLAYER] : [OFF]`,
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
                message.guild.channels.cache.find(ch => ch.name === 'krashr').send({embed: embed})
                console.log('[LOOK AT PLAYER] : [OFF]')
            }
            return lookAtPlayer;
        } catch(e){
            console.trace(e)
            message.guild.channels.cache.find(ch => ch.name === 'krashr').send(`[UNKNOWN ERROR]`)
        }
    }
}