module.exports = {
    name: 'inventory',
    description: "Shows whats in the player's inventory",
    async execute(message,bot,botId,commandArgs){
        try{
            const splitArgs = commandArgs.split(' ');
            const setting = splitArgs.shift();
            const slot = splitArgs.join(' ');

            if (!setting){
                message.guild.channels.cache.find(ch => ch.name === 'krashr').send(`Syntax : \`-inventory [raw/names/slot] (slot number)\``);
                return;
            }
            let getItems = new Promise((resolve,reject) =>{
                let temp = [];
                bot.inventory.items().forEach(item => {
                    temp.push(item)
                })
                resolve(temp)
            })
            getItems.then(async items => {
                if (setting == 'raw'){
                    items.forEach(item => {
                        message.guild.channels.cache.find(ch => ch.name === 'krashr').send(JSON.stringify(item))
                    })
                } else if (setting === 'names'){
                    async function updateEmbed(items){
                        
                        let item = items.shift();
                        if (!item){
                            embedInv.color = 0x00ff00;
                            messageInv.edit({embed: embedInv});
                            return
                        }
                        inventoryCount += 1
                        embedInv.title = `[ID:${botId}] [INVENTORY ITEMS] : ${inventoryCount}`;
                        if (inventoryCount % 24 === 0){
                            embedInv.color = 0x00ff00;
                            await messageInv.edit(({embed: embedInv}));
                            embedInv.color = 0x0089eb;
                            embedInv.fields = [{
                                name: `>> ${item.displayName} x ${item.count}`,
                                value: `\`(${item.name} : ${item.slot})\``,
                                inline: true,
                            }];
                            newMessage = new Promise(async (resolve,reject)=>{
                                let temp = await message.guild.channels.cache.find(ch => ch.name === 'krashr').send({ embed: embedInv })
                                resolve(temp)
                            })
                            newMessage.then((newmsg)=>{
                                messageInv = newmsg;
                                updateEmbed(items)
                            })
                        } else {
                            embedInv.fields.push({
                                name: `>> ${item.displayName} x ${item.count}`,
                                value: `\`(${item.name} : ${item.slot})\``,
                                inline: true,
                            });
                            messageInv.edit(({embed: embedInv})).then(()=>{
                                updateEmbed(items)
                            });
                        }
                    }
                    
                    let inventoryCount = 0;
                    let embedInv = {
                        color: 0x0089eb,
                        title: `[ID:${botId}] [INVENTORY ITEMS] : 0`,
                        author: {
                            name: message.author.username,
                            icon_url: message.author.avatarURL(),
                        },
                        fields: [],
                        timestamp: new Date(),
                        footer: {
                            text: message.guild.name,
                            icon_url: message.guild.iconURL(),
                        },
                    };
                    let messageInv = await message.guild.channels.cache.find(ch => ch.name === 'krashr').send({embed: embedInv})
                    //---
                    updateEmbed(items)
                } else if (setting === 'slot'){
                    items.forEach(item => {
                        if (item.slot === parseInt(slot)){
                            message.guild.channels.cache.find(ch => ch.name === 'krashr').send(JSON.stringify(item))
                        }
                    })
                }
            });
        } catch(e){
            console.trace(e)
            message.guild.channels.cache.find(ch => ch.name === 'krashr').send(`[ERROR] Try using the correct syntax \`-inventory [raw/names/slot] (slot number)\``)
        }
    }
}