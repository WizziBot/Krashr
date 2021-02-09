module.exports = {
    name: 'drop',
    description: "Drops all or specific item",
    async execute(message,commandArgs,bot,krashr){
        try{
            const splitArgs = commandArgs.split(' ');
            const setting = splitArgs.shift();
            const slot = splitArgs.shift();
            const amount = splitArgs.join(' ');
            if (!setting){
                message.guild.channels.cache.find(ch => ch.name === krashr.commandChannel).send(`Syntax : \`-drop [all/slot] (slot number)\``);
                return;
            }
            function updateEmbed(){
                dropCount += 1;
                embedDropped.title = `[DROPPED ITEM(S)] : ${dropCount}`;
                messageDropped.edit({embed: embedDropped})
            }
            function dropAllItems(items){
                let currItem = items.shift()
                if (!currItem) {
                    embedDropped.color = 0x00ff00;
                    messageDropped.edit(({embed: embedDropped}));
                    return;
                }
                tossItem(currItem.slot)
                setTimeout(()=>{
                    dropAllItems(items)
                },1000)
            }
            function itemBySlot (slot) {
                return bot.inventory.items().filter(item => item.slot === slot)[0]
            }
            function tossItem (slot, amount) {
                const item = itemBySlot(slot)
                if (!item) {
                    const embedNoItem = {
                        color: 0xff0000,
                        title: `Nothing in slot ${slot}`,
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
                    message.guild.channels.cache.find(ch => ch.name === krashr.commandChannel).send({embed: embedNoItem})
                } else if (amount) {
                    bot.toss(item.type, null, amount, checkIfTossed)
                } else {
                    bot.tossStack(item, checkIfTossed)
                }

                function checkIfTossed (err) {
                    if (err) {
                       const embed = {
                            color: 0xff0000,
                            title: `[ERROR] Unable to drop [${item.name}]`,
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
                        console.log(err.message)
                    } else if (amount) {
                        embedDropped.fields.push({
                            name: `>> \`${item.name}\` x \`${amount}\``,
                            value: '\u200b',
                            inline: true,
                        });
                        updateEmbed()
                    } else {
                        embedDropped.fields.push({
                            name: `>> \`${item.name}\` x \`${item.count}\``,
                            value: '\u200b',
                            inline: true,
                        });
                        updateEmbed()
                    }
                }
            }
            let dropCount = 0;
            let embedDropped = {
                color: 0x0089eb,
                title: `[DROPPED ITEM(S)] : 0`,
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
            let messageDropped = await message.guild.channels.cache.find(ch => ch.name === krashr.commandChannel).send({embed: embedDropped})
            let getItems = new Promise((resolve,reject) =>{
                let temp = [];
                bot.inventory.items().forEach(item => {
                    temp.push(item)
                })
                resolve(temp)
            })
            getItems.then(items => {
                if (setting == 'all'){
                    dropAllItems(items)
                } else if (setting === 'slot'){
                    items.forEach(item => {
                        if (item.slot === parseInt(slot)){
                            if (amount){
                                tossItem(parseInt(slot),parseInt(amount))
                            } else{
                                tossItem(parseInt(slot))
                            }
                        }
                    })
                    embedDropped.color = 0x00ff00;
                    messageDropped.edit(({embed: embedDropped}));
                }
            });

        } catch(e){
            console.trace(e)
            message.guild.channels.cache.find(ch => ch.name === krashr.commandChannel).send(`[ERROR] Try using the correct syntax \`-drop [all/slot] (slot number)\``)
        }
    }
}