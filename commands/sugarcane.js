module.exports = {
    name: 'sugarcane',
    description: "Farms sugarcane",
    execute(message,botId,commandArgs,startFarmLoop,activateKillSwitch,krashr){
        try{
            const yLevel = commandArgs
            if (!yLevel){
                message.guild.channels.cache.find(ch => ch.name === krashr.commandChannel).send(`Syntax: \`-sugarcane [y_level/off]\``)
            }
            if (yLevel === 'off') {
                activateKillSwitch(botId,message)
            } else {
                const embed = {
                    color: 0x00ff00,
                    title: `[ID:${botId}] [SUGARCANE FARMING] : [ON]`,
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
                startFarmLoop(botId,parseInt(yLevel),message)
            }
        } catch(e){
            console.trace(e)
            message.guild.channels.cache.find(ch => ch.name === krashr.commandChannel).send(`[ERROR] try using the correct syntax: \`-sugarcane [y_level/off]\``)
        }
    }
}