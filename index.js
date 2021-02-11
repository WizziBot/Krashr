const Discord = require('discord.js');
const client = new Discord.Client();
const delay = require('delay');
const fs = require('fs');
client.commands = new Discord.Collection();
const mineflayer = require('mineflayer');
const { Movements, goals } = require('mineflayer-pathfinder');
const { Vec3 } = require('vec3')
const GoalFollow = goals.GoalFollow;
const GoalBlock = goals.GoalBlock;
let alertWhitelist = require('./whitelist.json');
let blacklist = require('./blacklist.json');
const krashr = require('./krashr.json');
const proxies = require('./proxies.json')
const accounts = krashr.accounts;
const commandChannel = krashr.commandChannel
const alertsChannel = krashr.alertsChannel
const PREFIX = krashr.prefix;
let bots = [];
let chatOn = [];
let lookAtPlayer = [];
let pickUpItems = [];
let followPlayer = [];
let autosell = [];
let farmKillSwitch = [];
let yLevel = [];
let blocks = [];
let nearBlocks = [];
let goal = [];
let memoryWarning = [];
let amplifyCounter = [];
let terminationDelay = [];
let recursiveMining = [];
let hasGoal = [];
let intrusionAlert = {
    range: null,
    do: false,
    delay: true,
};
let blacklistAlert = {
    do: false,
    delay: true,
};
function appendNewData(){
    chatOn.push(false);
    lookAtPlayer.push(false);
    autosell.push(false)
    farmKillSwitch.push(true)
    yLevel.push(0)
    blocks.push(null)
    nearBlocks.push(null)
    goal.push(null)
    memoryWarning.push(true)
    amplifyCounter.push(10)
    terminationDelay.push(true)
    recursiveMining.push(false)
    hasGoal.push({
        has: false,
        goal: null
    })
    pickUpItems.push({
        item:null,
        do: false,
        exists: false,
        destroy: false,
        maxdist: 0
    });
    followPlayer.push({
        player: null,
        destroy: false,
        follow: false
    });
}
function getChatOn(botId){
    return chatOn[botId];
}
function pickUpModify(botId,pdo,exists,itemEntity){
    try{
        pickUpItems[botId].do = pdo;
        pickUpItems[botId].exists = exists;
        pickUpItems[botId].item = itemEntity;
    } catch(e){
        console.trace(e)
    }
}
function killSwitch(botId){
    try{
        if(followPlayer[botId].follow === true){
            followPlayer[botId].follow = false;
            followPlayer[botId].destroy = false;
            followPlayer[botId].player = null;
            console.log(`[ID:${botId}] [FOLLOW PLAYER (${followPlayer[botId].player})] : [OFF]`)
        }
    } catch(e){
        console.trace(e)
    }
}
function activateKillSwitch(botId,message){
    farmKillSwitch[botId] = true;
    const embed = {
        color: 0xff0000,
        title: `[ID:${botId}] [SUGARCANE FARMING] : [OFF]`,
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
    message.guild.channels.cache.find(ch => ch.name === commandChannel).send({embed: embed})
}
function resetVariables(hard = false){
    let curBotCount = bots.length;
    chatOn = [];
    lookAtPlayer = [];
    pickUpItems = [];
    followPlayer = [];
    autosell = [];
    farmKillSwitch = [];
    yLevel = [];
    blocks = [];
    nearBlocks = [];
    goal = [];
    memoryWarning = [];
    amplifyCounter = [];
    terminationDelay = [];
    recursiveMining = [];
    hasGoal = [];
    intrusionAlert = {
        range: null,
        do: false,
        delay: true,
    };
    blacklistAlert = {
        do: false,
        delay: true,
    };
    if(!hard){
        for(i = 0; i < curBotCount; i++){
            appendNewData()
        }
    }
}
function addBot(bot){
    if(bot){
        bots.push(bot)
    }
}
//DISCORD BOT

//collect commands from command folder
const commandFiles = fs.readdirSync('./commands/').filter(file => file.endsWith('.js'));
for(const file of commandFiles){
    const command = require(`./commands/${file}`);
    client.commands.set(command.name, command);
}

client.once('ready', () => {
    let onlineEmbed = {
        color: 0x00ff00,
        title: `\u2705 [${client.user.username.toUpperCase()} IS ONLINE]`,
        timestamp: new Date()
    };
    client.guilds.cache.forEach(guild => {
        try{
            guild.channels.cache.find(ch => ch.name === alertsChannel).send({embed:onlineEmbed})
        } catch {
            //ignore
        }
    })
    console.log(`DISCORD : [KRASHR IS ONLINE]`);
    botLoop()
});

client.on('message',async message => {
    try{
        //resolves command and args
        if(message.guild === null) return;
        if(!message.content.startsWith(PREFIX) || message.author.bot) return;
        if(!message.member.roles.cache.find(role => role.name === "Krashr Mod") && message.member.id !== '372325472811352065') return
        if(message.channel.name !== commandChannel) return;
        const preargs = message.content.slice((PREFIX.length)).trim().split(' ');
        const args = preargs.filter(function (el) {
            return el != '';
        });
        const botId = parseInt(args.shift());
        const command = args.shift().toLowerCase();
        const commandArgs = args.join(' ');
    
        //commands
        if (botId > accounts.length) return;

        if (command === 'login'){
            appendNewData()
            client.commands.get('login').execute(bots.length,accounts[bots.length],client,message,commandArgs,mineflayer,getChatOn,addBot,resetVariables,krashr)
        } else if (command === 'loginall'){
            let counter = bots.length;
            accounts.forEach((account) => {
                appendNewData()
                client.commands.get('login').execute(counter,account,client,message,commandArgs,mineflayer,getChatOn,addBot,resetVariables,krashr)
                counter += 1;
            })
        }

        if (!bots[botId]) return;

        if(command === 'togglechat'){
            chatOn[botId] = client.commands.get('togglechat').execute(message,botId,chatOn[botId],krashr)
        } else if (command === 'intrusionalert'){
            intrusionAlert = client.commands.get('intrusionAlert').execute(message,intrusionAlert,commandArgs,krashr)
        } else if (command === 'blacklistalert'){
            blacklistAlert = client.commands.get('blacklistAlert').execute(message,blacklistAlert,krashr)
        } else if (command === 'inventory'){
            client.commands.get('inventory').execute(message,bots[botId],botId,commandArgs,krashr);
        } else if (command === 'cs'){
            //client.commands.get('connectSequence').execute(message,commandArgs,bots[botId],krashr);
        } else if (command === 'chat'){
            bots[botId].chat(commandArgs);
        } else if (command === 'lap'){
            lookAtPlayer[botId] = client.commands.get('lookAtPlayer').execute(message,lookAtPlayer[botId],krashr)
        } else if (command === 'follow'){
            followPlayer[botId] = client.commands.get('followPlayer').execute(message,followPlayer[botId],commandArgs,botId,krashr)
        } else if (command === 'cancelfollow'){
            followPlayer[botId] = client.commands.get('cancelFollowPlayer').execute(message,followPlayer[botId],botId,krashr)
        } else if (command === 'players'){
            client.commands.get('players').execute(message,bots[botId],commandArgs,krashr);
        } else if (command === 'drop'){
            client.commands.get('drop').execute(message,commandArgs,bots[botId],krashr);
        } else if (command === 'coordinates'){
            client.commands.get('coordinates').execute(message,bots[botId],krashr);
        } else if (command === 't'){
            //testcommand
        } else if (command === 'pickupitems'){
            pickUpItems[botId] = client.commands.get('pickUpItems').execute(message,pickUpItems[botId],commandArgs,botId,krashr)
        } else if (command === 'sugarcane'){
            client.commands.get('sugarcane').execute(message,botId,commandArgs,startFarmLoop,activateKillSwitch,krashr)
        } else if (command === 'autosell'){
            autosell[botId] = client.commands.get('autosell').execute(message,autosell[botId],commandArgs,botId,krashr);
        } else if (command === 'allautosell'){
            let counter = 0;
            autosell.forEach(() => {
                autosell[counter] = client.commands.get('autosell').execute(message,autosell[counter],commandArgs,counter,krashr);
                counter += 1;
            })
        } else if (command === 'allchat'){
            bots.forEach(bot => {
                bot.chat(commandArgs);
            })
        } else if (command === 'botsdata'){
            let counter = 0;
            bots.forEach(bot => {
                message.guild.channels.cache.find(ch => ch.name === commandChannel).send(`[ID:${counter}] : [ACC:${bot.username}]`)
                counter += 1;
            })
        } else if (command === 'reset'){
            bots.forEach(bot =>{
                bot.quit()
            })
            bots = []
            resetVariables(true)
        } else if (command === 'showwhitelist'){
            message.guild.channels.cache.find(ch => ch.name === commandChannel).send(JSON.stringify(alertWhitelist))
        } else if (command === 'showblacklist'){
            message.guild.channels.cache.find(ch => ch.name === commandChannel).send(JSON.stringify(blacklist))
        }
    } catch(e) {
        console.trace(e)
        message.guild.channels.cache.find(ch => ch.name === commandChannel).send(`[ERROR: BOT DOES NOT EXIST OR INVALID SYNTAX]`)
    }
});

function startFarmLoop(botId,y){
    try{
        let mcData = getData(bots[botId].version)
        yLevel[botId] = parseInt(y)
        blocks[botId] = bots[botId].findBlocks({
            matching: mcData.blocksByName.sugar_cane.id,
            maxDistance: 10,
            count: 400,
        })
        blocks[botId] = getValidBlocks(blocks[botId],yLevel)
        blocks[botId] = qSort(blocks[botId],bots[botId].entity.position)
        nearBlocks[botId] = getNearBlocks(blocks[botId],bots[botId].entity.position)
        nearBlocks[botId] = qSort(nearBlocks[botId],bots[botId].entity.position)
        nearBlocks[botId] = checkIfAir(bots[botId],nearBlocks[botId])
        const availableTools = bots[botId].inventory.items()
        for (const tool of availableTools) {
        if (tool.name === 'diamond_hoe') {
            bots[botId].equip(tool, 'hand')
            break
        }
        }
        farmKillSwitch[botId] = false;
    } catch(e){
        console.trace(e)
    }
}
const getData = require('minecraft-data');
function calcDistance(botPos,itemPos){
    let dx = botPos.x - itemPos.x;
    let dy = botPos.y - itemPos.y;
    let dz = botPos.z - itemPos.z;
    let dist = Math.sqrt((dx**2) + (dy**2) + (dz**2));
    return dist
}
function getValidBlocks(blocksToSort, yLevelGet){
    let tempBlocks = []
    blocksToSort.forEach(block => {
        if (block.y === yLevelGet) tempBlocks.push(block)
    })
    return tempBlocks;
}
function getNearBlocks(blocksToSort,botPos){
    let tempBlocks = []
    blocksToSort.forEach(block => {
        if (calcDistance(botPos,block) < 5) tempBlocks.push(block)
    })
    return tempBlocks
}
function checkIfAir(bot,nearbyBlocks){
    if(nearbyBlocks.length === 0) return nearbyBlocks
    let tempNearBlocks = []
    let lastBlock = new Vec3(0,0,0)
    nearbyBlocks.forEach(block => {
        let data = bot.blockAt(block,false);
        try{
            if(data){
                if (data.name === 'sugar_cane'){
                    if(block.x !== lastBlock.x || block.z !== lastBlock.z){
                        tempNearBlocks.push(block)
                        lastBlock = block
                    }
                }
            }
        } catch(e) {
            console.trace(e)
            return tempNearBlocks
        }
    })
    return tempNearBlocks
}
function qSort(blocksPos,botPos){
    
    if (blocksPos.length < 2){
        return blocksPos
    }
    const pivot = blocksPos[blocksPos.length - 1];
    const left = [],
        right = []
    for (let i = 0; i < blocksPos.length - 1; i++) {
        if (calcDistance(botPos,blocksPos[i]) < calcDistance(botPos,pivot)) {
        left.push(blocksPos[i])
        } else {
        right.push(blocksPos[i])
        }
    }
    return [...qSort(left,botPos), pivot, ...qSort(right,botPos)];

}
function goalCheck(botId){
    if(!hasGoal[botId].has) return
    if(!hasGoal[botId].goal) {
        console.log('NO GOALllllllllllllllllllllllllllllllllll')
        return
    }
    let data = bots[botId].blockAt(goal,false);
    try{
        if(data){
            if (data.name !== 'sugar_cane'){
                hasGoal[botId].has = true
            }
        } else {
            console.log('WHAT THE FUCKkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkk')
        }
    } catch(e) {
        console.trace(e)
        return tempNearBlocks
    }
}
function onTick(bot,botId,lookAtPlayer,followPlayer,pickUpItems,autosell,yLevel){
    try{
        let mcData = getData(bot.version)
        if (lookAtPlayer) {
            const playerFilter = (entity) => entity.type === 'player';
            const playerEntity = bot.nearestEntity(playerFilter);
            if (playerEntity){
                const pos = playerEntity.position.offset(0, playerEntity.height, 0)
                bot.lookAt(pos)
            }
        }
        //## sugarcane farming algoritm VERSION 3.1.0 (iterative)
        goalCheck(botId)
        if (!farmKillSwitch[botId] && terminationDelay[botId] && !hasGoal[botId].has) {
            blocks[botId] = qSort(blocks[botId],bots[botId].entity.position)
            blocks[botId] = checkIfAir(bots[botId],blocks[botId])
            let shiftblock = blocks[botId].shift()
            nearBlocks[botId] = checkIfAir(bots[botId],nearBlocks[botId])
            nearBlocks[botId] = qSort(nearBlocks[botId],bots[botId].entity.position)
            try{
                if (nearBlocks[botId].length > 0){
                    amplifyCounter[botId] = 10
                    function rMine(){
                        recursiveMining[botId] = true;
                        let nearblock = nearBlocks[botId].shift()
                        if(nearblock){
                            let currblock = bots[botId].blockAt(nearblock,false)
                            bots[botId].dig(currblock,(err) => {
                                if (err) throw err
                                if(nearBlocks[botId].length > 0){
                                    setTimeout(()=>{
                                        rMine()
                                    },50)
                                } else {
                                    recursiveMining[botId] = false;
                                }
                            })
                        } else {
                            recursiveMining[botId] = false;
                        }
                    }
                    if(!recursiveMining[botId]){
                        rMine()
                    } else {
                        hasGoal[botId].goal = shiftblock;
                        let currblock = bots[botId].blockAt(shiftblock,false)
                        let movements = new Movements(bot, mcData)
                        movements.canDig = false;
                        movements.scafoldingBlocks = []
                        bots[botId].pathfinder.setMovements(movements)
                        goal[botId] = new GoalBlock(currblock.position.x, currblock.position.y - 1, currblock.position.z)
                        bots[botId].pathfinder.setGoal(goal[botId],false)
                        bots[botId].setControlState('sprint', true);
                    }
                } else if (shiftblock) {
                    let currblock = bots[botId].blockAt(shiftblock,false)
                    let movements = new Movements(bot, mcData)
                    movements.canDig = false;
                    movements.scafoldingBlocks = []
                    bots[botId].pathfinder.setMovements(movements)
                    goal[botId] = new GoalBlock(currblock.position.x, currblock.position.y - 1, currblock.position.z)
                    bots[botId].pathfinder.setGoal(goal[botId],false)
                    bots[botId].setControlState('sprint', true);
                    let newBlocks = bots[botId].findBlocks({
                        matching: mcData.blocksByName.sugar_cane.id,
                        maxDistance: 10,
                        count: 400,
                    })
                    let validblocks = getValidBlocks(newBlocks,yLevel)
                    blocks[botId].push(...validblocks)
                    blocks[botId].push(shiftblock)
                    blocks[botId] = qSort(blocks[botId],bots[botId].entity.position)
                    blocks[botId] = checkIfAir(bots[botId],blocks[botId])
                    while (blocks[botId].length > 500){
                        blocks[botId].pop()
                    }
                    nearBlocks[botId] = getNearBlocks(validblocks,bots[botId].entity.position)
                    let memoryLength = blocks[botId].length;
                    if (memoryLength < 50 && memoryWarning[botId] === true){
                        console.log(`[ID:${botId}] [${bot.username}] [#WARNING#] [BLOCK MEMORY AT ${memoryLength}]`)
                        let alertEmbed = {
                            color: 0x0000ff,
                            title: `[ID:${botId}] [${bot.username}] [#WARNING#] [BLOCK MEMORY AT ${memoryLength}]`,
                            timestamp: new Date()
                        };
                        client.guilds.cache.forEach(guild => {
                            try {
                                guild.channels.cache.find(ch => ch.name === alertsChannel).send({embed: alertEmbed})
                            } catch {
                                //ignore
                            }
                        })
                        memoryWarning[botId] = false
                        setTimeout(() => {
                            memoryWarning[botId] = true
                        },5000)
                    }
                } else {
                    amplifyCounter[botId] += 5
                    if (amplifyCounter > 100) {
                        console.log(`[ID:${botId}] [${bot.username}] [#WARNING#] [MAXIMUM AMPLIFICATION RANGE REACHED] [TERMINATING FARMING FOR 60s]`)
                        let alertEmbed = {
                            color: 0xff0000,
                            title: `[ID:${botId}] [${bot.username}] [#WARNING#] [MAXIMUM AMPLIFICATION RANGE REACHED] [TERMINATING FARMING FOR 60s]`,
                            timestamp: new Date()
                        };
                        client.guilds.cache.forEach(guild => {
                            try {
                                guild.channels.cache.find(ch => ch.name === alertsChannel).send({embed: alertEmbed})
                            } catch {
                                //ignore
                            }
                        })
                        amplifyCounter[botId] = 10
                        terminationDelay[botId] = false
                        setTimeout(() => {
                            terminationDelay[botId] = true
                        },60000)
                    } else {
                        let currTime = new Date();
                        console.log(`[ID:${botId}] AMPLIFIER: ${amplifyCounter[botId]} AT:${currTime}`)
                        blocks[botId] = bots[botId].findBlocks({
                            matching: mcData.blocksByName.sugar_cane.id,
                            maxDistance: amplifyCounter[botId],
                            count: (400 + (amplifyCounter[botId] ** 2)),
                        })
                        blocks[botId] = getValidBlocks(blocks[botId],yLevel)
                        blocks[botId] = qSort(blocks[botId],bots[botId].entity.position)
                        blocks[botId] = checkIfAir(bots[botId],blocks[botId])
                        nearBlocks[botId] = getNearBlocks(blocks[botId],bots[botId].entity.position)
                    }
                }
            } catch(e) {
                console.trace(e)
            }
        }
        //####
        if (pickUpItems.do && !followPlayer.follow) {
            let itemEntity;
            const itemFilter = (entity) => entity.type === 'object' && entity.objectType === 'Item';
            itemEntity = bot.nearestEntity(itemFilter);
            if(itemEntity){
                if (calcDistance(bot.entity.position,itemEntity.position) <= pickUpItems.maxdist){
                    pickUpModify(botId,true,true,itemEntity)
                    let movments = new Movements(bot, mcData)
                    movments.canDig = pickUpItems.destroy
                    if (!pickUpItems.destroy){
                        movments.scafoldingBlocks = []
                    }
                    bot.pathfinder.setMovements(movments)
                    try{
                        const goal = new GoalFollow(itemEntity, 0)
                        bot.pathfinder.setGoal(goal,false)
                    } catch(e) {
                        pickUpModify(botId,true,false,null)
                    }
                }
            }
        }
        if (followPlayer.follow && !pickUpItems.do){
            let followWho = bot.players[followPlayer.player];
            if(followWho){
                let movments = new Movements(bot, mcData)
                movments.canDig = followPlayer.destroy
                if (!followPlayer.destroy){
                    movments.scafoldingBlocks = []
                }
                bot.pathfinder.setMovements(movments)
                try{
                    const goal = new GoalFollow(followWho.entity, 2)
                    bot.pathfinder.setGoal(goal,false)
                } catch {
                    console.log('Unable to detect player')
                    let alertEmbed = {
                        color: 0xff0000,
                        title: `[ID:${botId}] [${bot.username}] [UNABLE TO DETECT PLAYER]`,
                        timestamp: new Date()
                    };
                    client.guilds.cache.forEach(guild => {
                        guild.channels.cache.find(ch => ch.name === alertsChannel).send({embed: alertEmbed})
                    })
                    killSwitch(botId)
                }
            } else {
                console.log('Unable to detect player')
                let alertEmbed = {
                    color: 0xff0000,
                    title: `[ID:${botId}] [${bot.username}] [UNABLE TO DETECT PLAYER]`,
                    timestamp: new Date()
                };
                client.guilds.cache.forEach(guild => {
                    guild.channels.cache.find(ch => ch.name === alertsChannel).send({embed: alertEmbed})
                })
                killSwitch(botId)
            }
        }
        if (autosell){
            let getItems = [];
            bots[botId].inventory.items().forEach(item => {
                getItems.push(item)
            })
            if (getItems.length > 34){
                console.log(`[ID:${botId}] [SOLD ALL]`)
                bots[botId].chat('/sell all')
                bots[botId].chat(`/pay ${krashr.autoPayTarget} 60000`)
                bots[botId].chat(`/pay ${krashr.autoPayTarget} 60000`)
            }
        }
        if (intrusionAlert.do && intrusionAlert.delay){
            let nearbyPlayersData = bot.players;
            let nearbyPlayers = Object.keys(nearbyPlayersData);
            nearbyPlayers.forEach(playerKey => {
                let player = nearbyPlayersData[playerKey]
                if(player.entity && !alertWhitelist.includes(player.username)){
                    try{
                        if(calcDistance(bots[botId].entity.position,player.entity.position) < intrusionAlert.range){
                            let currTime = new Date();
                            let coordinates = []
                            Object.values(player.entity.position).forEach(coord => {coordinates.push(Math.round(coord))})
                            console.log(`[ID:${botId}] [PLAYER INTRUSION DETECTED (${player.username}) AT] : ${coordinates} : ${currTime}`)
                            let alertEmbed = {
                                color: 0xffff00,
                                title: `[ID:${botId}] [PLAYER INTRUSION DETECTED (${player.username})] : ${coordinates}`,
                                timestamp: new Date()
                            };
                            client.guilds.cache.forEach(guild => {
                                try{
                                    guild.channels.cache.find(ch => ch.name === alertsChannel).send('<@&808051486562058290>')
                                    guild.channels.cache.find(ch => ch.name === alertsChannel).send({embed: alertEmbed})
                                } catch{
                                    //ignore
                                }
                            })
                            intrusionAlert.delay = false;
                            setTimeout(async () => {
                                intrusionAlert.delay = true;
                            },10000)
                        }
                    } catch(e){
                        console.trace(e)
                        console.log(player)
                        let currTime = new Date();
                        console.log(`CAUGHT FAULTY PLAYER : ${player.uuid} AT: ${currTime}`)
                        console.log(`To Playername : ${Object.values(bot.entities).find(entity => entity.type === 'player' && entity.id === player.uuid)}`)
                        let alertEmbed = {
                            color: 0xffff00,
                            title: `[ID:${botId}] [INVALID PLAYER DETECTED (${player.uuid})] : ${coordinates}`,
                            timestamp: new Date()
                        };
                        client.guilds.cache.forEach(guild => {
                            try{
                                guild.channels.cache.find(ch => ch.name === alertsChannel).send('<@&808051486562058290>')
                                guild.channels.cache.find(ch => ch.name === alertsChannel).send({embed: alertEmbed})
                            } catch{
                                //ignore
                            }
                        })
                    }
                }
            })
        }
        if (blacklistAlert.do && blacklistAlert.delay){
            let nearbyPlayersData = bot.players;
            let nearbyPlayers = Object.keys(nearbyPlayersData);
            nearbyPlayers.forEach(playerKey => {
                let player = nearbyPlayersData[playerKey]
                if(blacklist.includes(player.username)){
                    let currTime = new Date();
                    console.log(`[ID:${botId}] [BLACKLISTED PLAYER DETECTED (${player.username})] : ${currTime}`)
                    let alertEmbed = {
                        color: 0x150000,
                        title: `[ID:${botId}] [BLACKLISTED PLAYER DETECTED (${player.username})]`,
                        timestamp: new Date()
                    };
                    client.guilds.cache.forEach(guild => {
                        try{
                            guild.channels.cache.find(ch => ch.name === alertsChannel).send('<@&808051486562058290>')
                            guild.channels.cache.find(ch => ch.name === alertsChannel).send({embed: alertEmbed})
                        } catch{
                            //ignore
                        }
                    })
                    blacklistAlert.delay = false;
                    setTimeout(async () => {
                        blacklistAlert.delay = true;
                    },30000)
                }
            })
        }

    } catch(e){
        console.trace(e)
        console.log('ON TICK ERROR')
    }
}
function botLoop(){
    try{
        setInterval(()=>{
            let counterB = 0;
            bots.forEach(bot => {
                onTick(bot,counterB,lookAtPlayer[counterB],followPlayer[counterB],pickUpItems[counterB],autosell[counterB],yLevel[counterB])
                counterB += 1
            })
        },100)
    } catch(e) {
        console.trace(e)
        console.log('MAINLOOP')
    }
}

client.login(krashr.token);