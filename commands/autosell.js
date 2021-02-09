module.exports = {
    name: 'autosell',
    description: "Automatically sells all when inventory is full",
    async execute(message,autosell,commandArgs,botId,krashr){
        try{
            const setting = commandArgs

            if (!setting){
                message.guild.channels.cache.find(ch => ch.name === krashr.commandChannel).send(`Syntax : \`-autosell [on/off]\``);
                return;
            }
            if(setting === 'on'){
                autosell = true
                const embed = {
                    color: 0x00ff00,
                    title: `[ID:${botId}] [AUTOSELL] : [ON]`,
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
            } else if (setting === 'off'){
                autosell = false
                const embed = {
                    color: 0x00ff00,
                    title: `[ID:${botId}] [AUTOSELL] : [OFF]`,
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
            return autosell;
        } catch(e){
            console.trace(e)
            message.guild.channels.cache.find(ch => ch.name === krashr.commandChannel).send(`[UNKNOWN ERROR]`)
        }
    }
}