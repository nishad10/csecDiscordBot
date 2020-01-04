const Discord = require('discord.js')
const client = new Discord.Client()
const dotenv = require('dotenv')
const axios = require('axios')
const ramda = require('ramda')

import { getEvents } from './functions'
const httpClient = axios.create()
httpClient.defaults.timeout = 5000

const token = process.env.botToken
const logChannel = process.env.logChannel
const whiteListGuilds = ['648922022809829407', '619607468292571137'] // dev personal , csecclub

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`)
})

client.on('guildMemberAdd', member => {
  // Send the message to a designated channel on a server:
  const channel = member.guild.channels.find(ch => ch.name === 'general1')
  // Do nothing if the channel wasn't found on this server
  if (!channel) return
  // Send the message, mentioning the member
  channel.send(`Hey ${member} welcome to the CSEC discord server. Have Fun!`)
})

client.on('message', msg => {
  if (msg.content === '!ping') {
    msg.channel.send('pong')
  }
})

client.on('message', msg => {
  if (msg.content === '!help') {
    msg.channel.send('```\nHelp Test```')
  }
})

client.on('message', async msg => {
  if (msg.content === '!events') {
    const data = await getEvents()
    if (data[0]) {
      console.log(data[0])
      msg.channel.send(
        `Title: ${data[0].title}\nDate: ${data[0].month}, ${
          data[0].date
        }.\nDay: ${data[0].day}, Time: ${data[0].time}\nLocation: ${
          data[0].location
        }, RSVP Status: ${
          data[0].ticketStatus ? 'Can RSVP' : 'Cannot RSVP yet'
        }\n
       ${data[0].description}`,
      )
    }
  }
})

client.on('message', msg => {
  if (msg.content === '!mod') {
    if (msg.member.hasPermission('KICK_MEMBERS', false, false)) {
      msg.channel.send(
        '```\n!kick - Followed by this command give me a list of users to kick, make sure you @mention them. Example !kick @radiumBot\n\n!ban - Followed by this command give me a list of users to ban, make sure you @mention them. Example !ban @radiumBot```',
      )
    } else {
      console.log('ERROR user without permissions tried !mod command')
    }
  }
})
/*          const embed = {
              description: `${!ramda.isNil(bittrex)
                ? `[BITTREX](https://bittrex.com/Market/Index?MarketName=BTC-RADS)${priceTemplateBittrex(
                    'Bittrex',
                    bittrexData,
                    bittrexBTC
                  )}`
                : '\n[BITTREX](https://bittrex.com/Market/Index?MarketName=BTC-RADS) servers are down.'}
              ${!ramda.isNil(vcc)
                ? `\n[VCC](https://vcc.exchange/exchange/basic?currency=btc&coin=rads)${priceTemplateVCC(
                    'VCC',
                    vccData,
                    vccBTC
                  )}`
                : '\n[VCC](https://vcc.exchange/exchange/basic?currency=btc&coin=rads) servers are down.'}
                  ${!ramda.isNil(upbit)
                    ? `\n[UPbit](https://upbit.com/exchange?code=CRIX.UPBIT.BTC-RADS)${priceTemplateUpbit(
                        'Upbit',
                        upbitData,
                        upbitBTC
                      )}`
                    : '\n[UPbit](https://upbit.com/exchange?code=CRIX.UPBIT.BTC-RADS) Servers are down.'}
                  ${!ramda.isNil(finebox)
                    ? `\n[FINEXBOX](https://www.finexbox.com/market/pair/RADS-BTC.html)${priceTemplateFinexbox(
                        'Finexbox',
                        fineboxData,
                        coinMarketCapBTC
                      )}`
                    : '\n[FINEXBOX](https://www.finexbox.com/market/pair/RADS-BTC.html) Servers are down!'}`,
              color: 4405442
            }
            msg.channel.send('', { embed })
          } */

client.on('message', message => {
  if (!message.guild)
    // Ignore messages that aren't from a guild
    return

  // If the message content starts with "!kick"
  if (message.content.startsWith('!kick')) {
    // Assuming we mention someone in the message, this will return the user
    // Read more about mentions over at https://discord.js.org/#/docs/main/stable/class/MessageMentions

    if (message.member.hasPermission('KICK_MEMBERS', false, false)) {
      if (message.mentions.users.first()) {
        Array.from(message.mentions.users, ([key, value]) => {
          const user = value
          // const user = message.mentions.users.first()
          // If we have a user mentioned

          // Exclude bot from kicking itself to avoid circular
          if (user.id !== '653386053356617768') {
            // Now we get the member from the user
            const member = message.guild.member(user)
            // If the member is in the guild
            if (member && user.id !== `653386053356617768`) {
              /**
               * Kick the member
               * Make sure you run this on a member, not a user!
               * There are big differences between a user and a member
               */
              member
                .kick('Kicked by bot using command.')
                .then(() => {
                  // We let the message author know we were able to kick the person
                  ramda.contains(message.guild.id, whiteListGuilds)
                    ? client.channels
                        .get(logChannel)
                        .send(
                          `id:${message.author.id},username:${
                            message.author.username
                          }issued command and successfully kicked ${
                            user.tag
                          } at ${new Date().toLocaleDateString()}`,
                        )
                    : message.channel.send(
                        `id:${message.author.id},username:${
                          message.author.username
                        }issued command and successfully kicked ${
                          user.tag
                        } at ${new Date().toLocaleDateString()}`,
                      )
                })
                .catch(err => {
                  // An error happened
                  // This is generally due to the bot not being able to kick the member,
                  // either due to missing permissions or role hierarchy
                  ramda.contains(message.guild.id, whiteListGuilds)
                    ? client.channels
                        .get(logChannel)
                        .send(
                          `${message.author.username} issued ${message.content}. ERROR: Unable to kick the ${user.tag} this might be because I dont have permissions.`,
                        )
                    : message.channel.send(
                        `${message.author.username} issued ${message.content}. ERROR: Unable to kick the ${user.tag} this might be because I dont have permissions.`,
                      )
                  // Log the error
                  console.error('BOT couldnt KICK maybe permission error.', err)
                })
            } else {
              // The mentioned user isn't in this guild
              ramda.contains(message.guild.id, whiteListGuilds)
                ? client.channels
                    .get(logChannel)
                    .send(
                      `${message.author.username} issued ${message.content}. ERROR: Unable to kick the ${user.tag} this might be because user doesnt exist in server.`,
                    )
                : message.channel.send(
                    `${message.author.username} issued ${message.content}. ERROR: Unable to kick the ${user.tag} this might be because user doesnt exist in server.`,
                  )
            }
            // Otherwise, if no user was mentioned
          } else {
            ramda.contains(message.guild.id, whiteListGuilds)
              ? client.channels
                  .get(logChannel)
                  .send(
                    `${message.author.username} issued ${message.content}. ERROR: Unable to kick the ${user.tag} you cannot kick me using commands.`,
                  )
              : message.channel.send(
                  `${message.author.username} issued ${message.content}. ERROR: Unable to kick the ${user.tag} you cannot kick me using commands.`,
                )
          }
        })
      } else {
        ramda.contains(message.guild.id, whiteListGuilds)
          ? client.channels
              .get(logChannel)
              .send(
                `${message.author.username} issued ${message.content}. ERROR: Unable to kick this might be because you didnt specify users to kick`,
              )
          : message.channel.send(
              `${message.author.username} issued ${message.content}. ERROR: Unable to kick this might be because you didnt specify users to kick`,
            )
      }
    } else {
      console.error(
        `${message.author.username} issued ${message.content}. ERROR: You dont have permission to do this.`,
      )
    }
  }
})

client.on('message', message => {
  if (!message.guild)
    // Ignore messages that aren't from a guild
    return

  // if the message content starts with "!ban"
  if (message.content.startsWith('!ban')) {
    // Assuming we mention someone in the message, this will return the user
    // Read more about mentions over at https://discord.js.org/#/docs/main/stable/class/MessageMentions

    if (message.member.hasPermission(['KICK_MEMBERS', 'BAN_MEMBERS'])) {
      if (message.mentions.users.first()) {
        Array.from(message.mentions.users, ([key, value]) => {
          const user = value
          // If we have a user mentioned
          if (user.id !== '653386053356617768') {
            // Now we get the member from the user
            const member = message.guild.member(user)
            // If the member is in the guild
            if (member) {
              /**
               * Ban the member
               * Make sure you run this on a member, not a user!
               * There are big differences between a user and a member
               * Read more about what ban options there are over at
               * https://discord.js.org/#/docs/main/stable/class/GuildMember?scrollTo=ban
               */
              member
                .ban({
                  reason: 'They were bad!',
                })
                .then(() => {
                  // We let the message author know we were able to ban the person
                  ramda.contains(message.guild.id, whiteListGuilds)
                    ? client.channels
                        .get(logChannel)
                        .send(
                          `id:${message.author.id},username:${
                            message.author.username
                          }issued command and successfully banned ${
                            user.tag
                          } at ${new Date().toLocaleDateString()}`,
                        )
                    : message.channel.send(
                        `id:${message.author.id},username:${
                          message.author.username
                        }issued command and successfully banned ${
                          user.tag
                        } at ${new Date().toLocaleDateString()}`,
                      )
                })
                .catch(err => {
                  // An error happened
                  // This is generally due to the bot not being able to ban the member,
                  // either due to missing permissions or role hierarchy
                  ramda.contains(message.guild.id, whiteListGuilds)
                    ? client.channels
                        .get(logChannel)
                        .send(
                          `${message.author.username} issued ${message.content}. ERROR: Unable to BAN the ${user.tag} this might be because I dont have permissions.`,
                        )
                    : message.channel.send(
                        `${message.author.username} issued ${message.content}. ERROR: Unable to BAN the ${user.tag} this might be because I dont have permissions.`,
                      )
                  // Log the error
                  console.error('BOT couldnt BAN maybe permission error.', err)
                })
            } else {
              // The mentioned user isn't in this guild
              ramda.contains(message.guild.id, whiteListGuilds)
                ? client.channels
                    .get(logChannel)
                    .send(
                      `${message.author.username} issued ${message.content}. ERROR: Unable to BAN the ${user.tag} this might be because user doesnt exist in server.`,
                    )
                : message.channel.send(
                    `${message.author.username} issued ${message.content}. ERROR: Unable to BAN the ${user.tag} this might be because user doesnt exist in server.`,
                  )
            }
          } else {
            // Otherwise, if no user was mentioned
            ramda.contains(message.guild.id, whiteListGuilds)
              ? client.channels
                  .get(logChannel)
                  .send(
                    `${message.author.username} issued ${message.content}. ERROR: Unable to BAN the ${user.tag} you cannot kick me using commands.`,
                  )
              : message.channel.send(
                  `${message.author.username} issued ${message.content}. ERROR: Unable to BAN the ${user.tag} you cannot kick me using commands.`,
                )
          }
        })
      } else {
        ramda.contains(message.guild.id, whiteListGuilds)
          ? client.channels
              .get(logChannel)
              .send(
                `${message.author.username} issued ${message.content}. ERROR: Unable to BAN this might be because you didnt specify users to kick`,
              )
          : message.channel.send(
              `${message.author.username} issued ${message.content}. ERROR: Unable to BAN this might be because you didnt specify users to kick`,
            )
      }
    } else {
      console.error(
        `${message.author.username} issued ${message.content}. ERROR: You dont have permission to do this.`,
      )
    }
  }
})
client.on('disconnect', () => {
  console.log(
    `BOT shutting down at ${new Date().toLocaleDateString()} TIME : ${new Date().toLocaleTimeString()}`,
  )
})
client.login(token)
