const Discord = require('discord.js')
const client = new Discord.Client()
const dotenv = require('dotenv')
const ramda = require('ramda')

import {
  getEvents,
  doRsvp,
  getUser,
  getEventID,
  getUserInfo,
} from './functions'

const token = process.env.botToken
const logChannel = process.env.logChannel
const whiteListGuilds = ['648922022809829407', '619607468292571137'] // dev personal , csecclub

//   if (!ramda.contains(msg.guild.id, whiteListGuilds)) return
// To restrict access to certail guilds

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
  if (msg.author.bot) return
  if (msg.content === '!ping') {
    msg.channel.send('pong')
  }
})

client.on('message', msg => {
  if (msg.author.bot) return
  if (msg.content === '!help') {
    msg.channel.send(
      '```css\n!events - Get a list of all events and information on them.\n\n!rsvp - Info on how to rsvp to events\n\n!rsvp help - More Info on how to link your accounts to be able to rsvp from discord.\n\n!mod - Moderation commands\n\n!id - To get your discord id for linking you acount.```',
    )
  }
})

client.on('message', async msg => {
  if (msg.author.bot) return
  if (msg.content === '!events') {
    const data = await getEvents()
    if (data) {
      let list = ''
      data.map(event => {
        list += `\` Name: \` **${event.title}**\n\` Date: \` **${event.month}, ${event.date} from [ ${event.time} ]**\n\` Location: \` **${event.location}**\n\n`
      })
      const embed = {
        description: list,
      }

      msg.channel.send('', { embed })
    }
  }
})

client.on('message', async msg => {
  if (msg.author.bot) return
  if (msg.content === '!rsvp') {
    const embed = {
      description: `
** If you have already linked your account on the website with discord then the command you want is **
> Just replace EventName with the event you want to rsvp for. 
\`\`\`css
!rsvp EventName
\`\`\`

** If you want to find events then **
\`\`\`css
!events
\`\`\`

** For help on how to link accounts type ** 
\`\`\`css
!rsvp help
\`\`\`
`,
    }
    msg.channel.send('', { embed })
  }
})

client.on('message', async msg => {
  if (msg.content === '!rsvp help') {
    const embed = {
      description: `
** Link Discord-Website Accounts **
* You need to have an account on the csec website for this.

** New Account **
* To make a new account on the website go to [SignUp](https://www.utacsec.org/signup)
* You can enter your discord id while signing up on the website.
> To get your discord id type
\`\`\`css
!id
\`\`\`
* Once you type in your id and sign up you can then rsvp to events using the command listed on the top.

** Already have an account **
* If you already have an account on the website then log in and just go to you accounts page located here [Account](https://www.utacsec.org/account)
* Now get your discord id using \`!id\` and then enter it in the DiscordID section on account page.

`,
    }
    msg.channel.send('', { embed })
  }
})

//const regex = /(?<=!rsvp).*/gm
//const regex1 = /!rsvp([\s\S]*)/gm

client.on('message', async msg => {
  if (msg.author.bot) return
  if (msg.content.includes('!rsvp') && !msg.content.includes('!rsvpList')) {
    const param = msg.content.substr(6, msg.content.length)
    if (param !== 'help' && param !== '') {
      const user = await getUser(msg.member.id)
      if (user.status !== 200) {
        msg.channel.send(
          'Failed! Please make sure you have your discord account linked to the website account try\n```css\n!rsvp help```',
        )
      }
      const event = await getEventID(param)
      if (event.status !== 200) {
        msg.channel.send(
          'Failed! That event does not exist please check you are typing the name in exact same way. Check by typing\n```css\n!events```',
        )
      }
      const data = await doRsvp(event.data._id, user.data._id)
      if (data.status !== 200) {
        if (data.data.message) {
          msg.channel.send(data.data.message)
        } else msg.channel.send('Failed! Something went wrong ')
      } else
        msg.channel.send(
          'Thank you the RSVP! We look forward to seeing you at the event.',
        )
    }
  }
})

client.on('message', async msg => {
  if (msg.author.bot) return
  if (msg.content.includes('!rsvpList')) {
    const param = msg.content.substr(10, msg.content.length)
    if (param && param !== '') {
      const event = await getEventID(param)
      if (event && event.status !== 200) {
        msg.channel.send(
          'Failed! That event does not exist please check you are typing the name in exact same way. Check by typing\n```css\n!events```',
        )
      }
      if (event && event.status === 200) {
        const list = await getUserInfo(event.data.rsvpList, msg)
      }
    }
  }
})

client.on('message', async msg => {
  if (msg.author.bot) return
  if (msg.content === '!id') {
    msg.channel.send(`Your discord id is \`${msg.member.id}\``)
  }
})

client.on('message', msg => {
  if (msg.author.bot) return
  if (msg.content === '!mod') {
    if (msg.member.hasPermission('KICK_MEMBERS', false, false)) {
      msg.channel.send(
        '```\n!rsvpList EventName - Change EventName to the name of event you want info on.\n\n!kick - Followed by this command give me a list of users to kick, make sure you @mention them. Example !kick @CSECBOT\n\n!ban - Followed by this command give me a list of users to ban, make sure you @mention them. Example !ban @CSECBOT```',
      )
    } else {
      console.log('ERROR user without permissions tried !mod command')
    }
  }
})

client.on('message', message => {
  if (message.author.bot) return
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
!client.on('message', message => {
  if (message.author.bot) return
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
