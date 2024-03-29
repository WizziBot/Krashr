module.exports = {
    name: 'intrusionAlert',
    description: "Toggles all bots to detect threat players in a given range",
    execute(message,intrusionAlert,commandArgs,krashr){
        try{
            const range = commandArgs
            if (!range){
                message.channel.send(`[ERROR] Try using a valid syntax \`-intrusionalert [maxrange/off]\``)
                return
            }
            if(intrusionAlert.do === true && range === 'off'){
                intrusionAlert.do = false;
                intrusionAlert.range = null;
                const embed = {
                    color: 0xff0000,
                    title: `[ID:ALL] [INTRUSION DETECTION (${range}) BLOCKS] : [OFF]`,
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
                console.log(`[ID:ALL] [INTRUSION DETECTION (${range}) BLOCKS] : [OFF]`)
            } else if(intrusionAlert.do === false){
                intrusionAlert.do = true;
                intrusionAlert.range = parseInt(range);
                const embed = {
                    color: 0x00ff00,
                    title: `[ID:ALL] [INTRUSION DETECTION (${range}) BLOCKS] : [ON]`,
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
                console.log(`[ID:ALL] [INTRUSION DETECTION (${range}) BLOCKS] : [ON]`)
            }
            return intrusionAlert;
        } catch(e){
            console.trace(e)
            message.channel.send(`[ERROR] Try using a valid syntax \`-intrusionalert [maxrange/off]\``)
        }
    }
}