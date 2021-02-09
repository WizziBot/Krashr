module.exports = {
    name: 'pickUpItems',
    description: "Picks up nearby items",
    execute(message,pickUpItems,commandArgs,botId,krashr){
        try{
            const splitArgs = commandArgs.split(' ');
            const maxdist = splitArgs.shift();
            const destroy = splitArgs.join(' ');
            if (!maxdist){
                message.guild.channels.cache.find(ch => ch.name === krashr.commandChannel).send(`Syntax: \`-pickupitems [max_distance/off] (canbuild[yes])\``)
                return pickUpItems;
            } else if(maxdist === 'off'){
                pickUpItems.do = false;
                pickUpItems.exists = false;
                pickUpItems.item = null;
                pickUpItems.destroy = false;
                const embed = {
                    color: 0xff0000,
                    title: `[ID:${botId}] [PICK UP ITEMS] : [OFF]`,
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
                console.log(`[ID:${botId}] [PICK UP ITEMS] : [OFF]`)
                return pickUpItems;
            } else{
                if(pickUpItems.do === false){
                    pickUpItems.do = true;
                    pickUpItems.maxdist = parseInt(maxdist);
                    if (destroy === 'yes'){
                        pickUpItems.destroy = true;
                    }
                    const embed = {
                        color: 0x00ff00,
                        title: `[ID:${botId}] [PICK UP ITEMS] : [ON]`,
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
                    console.log(`[ID:${botId}] [PICK UP ITEMS] : [ON]`)
                    return pickUpItems;
                }
            }
        } catch(e){
            console.trace(e)
            message.guild.channels.cache.find(ch => ch.name === krashr.commandChannel).send(`[ERROR] try using the correct syntax: \`-pickupitems [max_distance/off] (canbuild[yes])\``)
        }
    }
}