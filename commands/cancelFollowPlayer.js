module.exports = {
    name: 'cancelFollowPlayer',
    description: "Stops following the player",
    execute(message,followPlayer,botId,krashr){
        try{
            if(followPlayer.follow === true){
                console.log(`[ID:${botId}] [FOLLOW PLAYER (${followPlayer.player})] : [OFF]`)
                const embed = {
                    color: 0xff0000,
                    title: `[ID:${botId}] [FOLLOW PLAYER (${followPlayer.player})] : [OFF]`,
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
                followPlayer.follow = false;
                followPlayer.destroy = false;
                followPlayer.player = null;
            }
            return followPlayer;
        } catch(e){
            console.trace(e)
            message.guild.channels.cache.find(ch => ch.name === krashr.commandChannel).send(`[UNKNOWN ERROR]`)
        }
    }
}