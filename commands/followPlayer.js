module.exports = {
    name: 'followPlayer',
    description: "Follows the player",
    execute(message,followPlayer,commandArgs,botId,krashr){
        try{
            const splitArgs = commandArgs.split(' ');
            const player = splitArgs.shift();
            const destroy = splitArgs.join(' ');
            if (!player){
                message.guild.channels.cache.find(ch => ch.name === krashr.commandChannel).send(`Syntax : \`-follow username (canbuild[yes])\``);
                return;
            }
            if(followPlayer.follow === false){
                followPlayer.follow = true;
                followPlayer.player = player;
                if(destroy === 'yes'){
                    followPlayer.destroy = true;
                }
                const embed = {
                    color: 0x00ff00,
                    title: `[ID:${botId}] [FOLLOW PLAYER (${player})] : [ON]`,
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
            }
            return followPlayer;
        } catch(e){
            console.trace(e)
            message.guild.channels.cache.find(ch => ch.name === krashr.commandChannel).send(`[ERROR] Try using the correct syntax: \`-follow username (canbuild[yes])\``)
        }
    }
}