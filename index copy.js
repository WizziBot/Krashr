const Discord = require('discord.js');
const client = new Discord.Client();
const delay = require('delay');
const fs = require('fs');
const PREFIX = "-";
client.commands = new Discord.Collection();
const mineflayer = require('mineflayer');
const mineflayerViewer = require('prismarine-viewer').mineflayer;
const { Movements, goals } = require('mineflayer-pathfinder');
const GoalFollow = goals.GoalFollow;
const GoalBlock = goals.GoalBlock;

const accounts = require('./accounts').accounts
let bots = [];
let botCounter = 0;
let chatOn = [];
let lookAtPlayer = [];
let pickUpItems = [];
let followPlayer = [];
let autosell = [];
let autoeat = [];
let farmKillSwitch = [];
function appendNewData(){
    chatOn.push(false);
    lookAtPlayer.push(false);
    autosell.push(false)
    autoeat.push(false)
    farmKillSwitch.push(false)
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
            console.log(`[ID:${botId} : [FOLLOW PLAYER (${followPlayer[botId].player})] : [OFF]`)
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
    message.guild.channels.cache.find(ch => ch.name === 'krashr').send({embed: embed})
}
function addBot(bot){
    bots.push(bot)
    botCounter += 1
}
//DISCORD BOT

//collect commands from command folder
const commandFiles = fs.readdirSync('./commands/').filter(file => file.endsWith('.js'));
for(const file of commandFiles){
    const command = require(`./commands/${file}`);
    client.commands.set(command.name, command);
}

client.once('ready', () => {
    client.guilds.cache.forEach(guild =>{
        guild.channels.cache.find(ch => ch.name === 'krashr').send('[ONLINE]')
    })
    console.log(`DISCORD : [KRASHR IS ONLINE]`);
    botLoop()
});

client.on('message',async message => {
    try{
        //resolves command and args
        if(message.guild === null) return;
        if(!message.content.startsWith(PREFIX) || message.author.bot) return;
        if(!message.member.roles.cache.find(role => role.name === "Krashr Mod")) return
        if(message.channel.name !== "krashr" && message.channel.name !== "krashr-chat-logger") return;
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
            client.commands.get('login').execute(botCounter,accounts[botCounter],client,message,commandArgs,mineflayer,getChatOn,addBot)
        } else if (command === 'loginall'){
            bots = [];
            let counter = 0;
            accounts.forEach((account) => {
                appendNewData()
                client.commands.get('login').execute(counter,account,client,message,commandArgs,mineflayer,getChatOn,addBot)
                counter += 1;
            })
        }

        if (!bots[botId]) return;

        if(command === 'togglechat'){
            chatOn[botId] = client.commands.get('togglechat').execute(message,chatOn)
        } else if (command === 'inventory'){
            client.commands.get('inventory').execute(message,bots[botId],botId,commandArgs);
        } else if (command === 'screen'){
            try{
                mineflayerViewer(bot, { port: 3007, firstPerson: true })
            } catch {
                message.guild.channels.cache.find(ch => ch.name === 'krashr').send(`[ALREADY HOSTED]`)
            }
        } else if (command === 'cs'){
            client.commands.get('connectSequence').execute(message,commandArgs,bots[botId]);
        } else if (command === 'chat'){
            bots[botId].chat(commandArgs);
        } else if (command === 'logout'){
            // client.commands.get('logout').execute(message,bot)
        } else if (command === 'lap'){
            lookAtPlayer[botId] = client.commands.get('lookAtPlayer').execute(message,lookAtPlayer[botId])
        } else if (command === 'follow'){
            followPlayer[botId] = client.commands.get('followPlayer').execute(message,followPlayer[botId],commandArgs,botId)
        } else if (command === 'cancelfollow'){
            followPlayer[botId] = client.commands.get('cancelFollowPlayer').execute(message,followPlayer[botId],bots,botId)
        } else if (command === 'players'){
            client.commands.get('players').execute(message,bots[botId],commandArgs);
        } else if (command === 'drop'){
            client.commands.get('drop').execute(message,commandArgs,bots[botId]);
        } else if (command === 'coordinates'){
            client.commands.get('coordinates').execute(message,bots[botId]);
        } else if (command === 't'){
            //
        } else if (command === 'pickupitems'){
            pickUpItems[botId] = client.commands.get('pickUpItems').execute(message,pickUpItems[botId],commandArgs,botId)
        } else if (command === 'sugarcane'){
            client.commands.get('sugarcane').execute(message,botId,commandArgs,startFarmLoop,activateKillSwitch)
        } else if (command === 'autosell'){
            autosell[botId] = client.commands.get('autosell').execute(message,autosell[botId],commandArgs,botId);
        } else if (command === 'allautosell'){
            let counter = 0;
            autosell.forEach(() => {
                autosell[counter] = client.commands.get('autosell').execute(message,autosell[counter],commandArgs,counter);
                counter += 1;
            })
        } else if (command === 'allchat'){
            bots.forEach(bot => {
                bot.chat(commandArgs);
            })
        } else if (command === 'botsdata'){
            let counter = 0;
            bots.forEach(bot => {
                message.guild.channels.cache.find(ch => ch.name === 'krashr').send(`[ID:${counter}] : [ACC:${bot.username}]`)
                counter += 1;
            })
        } else if (command === 'reset'){
            bots.forEach(bot =>{
                bot.quit()
            })
            botCounter = 0
            bots = []
            chatOn = [];
            lookAtPlayer = [];
            pickUpItems = [];
            followPlayer = [];
            autosell = [];
            autoeat = [];
            farmKillSwitch = [];
        }
    } catch(e) {
        console.trace(e)
        message.guild.channels.cache.find(ch => ch.name === 'krashr').send(`[ERROR: BOT DOES NOT EXIST OR INVALID SYNTAX]`)
    }
});
function fullStop () {
    bot.clearControlStates()

    // Force horizontal velocity to 0 (otherwise inertia can move us too far)
    // Kind of cheaty, but the server will not tell the difference
    bot.entity.velocity.x = 0
    bot.entity.velocity.z = 0

    const blockX = Math.floor(bot.entity.position.x) + 0.5
    const blockZ = Math.floor(bot.entity.position.z) + 0.5

    // Make sure our bounding box don't collide with neighboring blocks
    // otherwise recenter the position
    if (Math.abs(bot.entity.position.x - blockX) > 0.2) { bot.entity.position.x = blockX }
    if (Math.abs(bot.entity.position.z - blockZ) > 0.2) { bot.entity.position.z = blockZ }
  }

function startFarmLoop(botId,yLevel,message){
    try{
        farmKillSwitch[botId] = false;
        function mineBlocks(blocks,mcData){
            if (farmKillSwitch[botId]) {
                message.guild.channels.cache.find(ch => ch.name === 'krashr').send(`[ID:${botId}] [AUTO FARMING] : [OFF]`)
                return
            }
            let shiftblock = blocks.shift()
            if (shiftblock){
                try{
                    if (shiftblock.y !== yLevel){
                        while (shiftblock.y !== yLevel){
                            shiftblock = blocks.shift()
                        }
                    }
                    let currblock = bots[botId].blockAt(shiftblock,false)
                    let movements = new Movements(bot, mcData)
                    movements.canDig = false;
                    movements.scafoldingBlocks = []
                    bots[botId].pathfinder.setMovements(movements)

                    let goal = new GoalBlock(shiftblock.x, shiftblock.y - 1, shiftblock.z)
                    bots[botId].pathfinder.setGoal(goal,false)
                    if(calcDistance(bots[botId].entity.position,goal) > 4){
                        mineBlocks(blocks,mcData)
                    } else {
                        fullStop()
                        bots[botId].dig(currblock, (err) => {
                            if (err) console.trace(err)
                            setTimeout(()=>{
                                mineBlocks(blocks,mcData)
                            },100)
                        })
                    }
                } catch(e) {
                    try{
                    let blocks = bots[botId].findBlocks({
                        matching: mcData.blocksByName.sugar_cane.id,
                        maxDistance: 10,
                        count: 200,
                    })
                    if (blocks.length === 0) {
                        message.guild.channels.cache.find(ch => ch.name === 'krashr').send(`[CANNOT DETECT SUGARCANE]`)
                        return
                    }
                    setTimeout(() => {
                        mineBlocks(blocks,mcData)
                    },500)
                    } catch(e) {
                        console.trace(e)
                    }
                }
            } else {
                let blocks = bots[botId].findBlocks({
                    matching: mcData.blocksByName.sugar_cane.id,
                    maxDistance: 10,
                    count: 200,
                })
                if (blocks.length === 0) {
                    message.guild.channels.cache.find(ch => ch.name === 'krashr').send(`[CANNOT DETECT SUGARCANE]`)
                    return
                }
                setTimeout(() => {
                    mineBlocks(blocks,mcData)
                },500)
            }
        }

        //start loop
        let mcData = getData(bots[botId].version)
        let blocks = bots[botId].findBlocks({
            matching: mcData.blocksByName.sugar_cane.id,
            maxDistance: 10,
            count: 50,
        })
        mineBlocks(blocks,mcData)
    } catch(e){
        //pass
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
function onTick(bot,botId,lookAtPlayer,followPlayer,pickUpItems,autosell){
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
                    client.guilds.forEach(guild => {
                        guild.channels.cache.find(ch => ch.name === 'krashr').send(`[UNABLE TO DETECT PLAYER]`)
                    })
                    killSwitch(botId)
                }
            } else {
                console.log('Unable to detect player')
                client.guilds.forEach(guild => {
                    guild.channels.cache.find(ch => ch.name === 'krashr').send(`[UNABLE TO DETECT PLAYER]`)
                })
                killSwitch(botId)
            }
        } if (autosell){
            let getItems = new Promise((resolve,reject) =>{
                let temp = [];
                bots[botId].inventory.items().forEach(item => {
                    temp.push(item)
                })
                resolve(temp)
            })
            getItems.then(items => {
                if (items.length > 34){
                    console.log(`[ID:${botId}] [SOLD ALL]`)
                    bots[botId].chat('/sell all')
                }
            })
        }
    } catch(e){
        //
    }
}
function botLoop(){
    let counterB = 0;
    bots.forEach(bot => {
        onTick(bot,counterB,lookAtPlayer[counterB],followPlayer[counterB],pickUpItems[counterB],autosell[counterB])
        counterB += 1
    })
    setTimeout(() => {
        botLoop()
    },200)
}

client.login('ODA2OTAzMTA3NTk0MDkyNTU0.YBwNFA.CNrD-BT59yngjDNhivxI233yDm8');