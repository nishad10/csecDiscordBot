import axios from 'axios'

axios.defaults.baseURL = 'http://localhost:8000'
// 'https://utacsecapi.herokuapp.com' || 'http://localhost:8000'

export const getEvents = () => {
  return axios
    .get(`/eventsAdmin`)
    .then(res => {
      return res.data
    })
    .catch(error => {
      console.log(error)
    })
}
export const getEventID = eventName => {
  return axios
    .post(`/getEventInfo`, { eventName })
    .then(res => {
      return res
    })
    .catch(error => {
      console.log(error)
    })
}

export const getUser = discordID => {
  return axios
    .post(`/discordUser`, { discordID })
    .then(res => {
      return res
    })
    .catch(error => {
      console.log(error)
    })
}
export const getUserInfo = (list, msg) => {
  Promise.all(
    list.map(id =>
      axios
        .post(`/getUserInfo`, { id })
        .then(res => {
          return res.data
        })
        .catch(err => err),
    ),
  ).then(data => {
    msg.channel.send(JSON.stringify(data))
    return data
  })
}
export const doRsvp = (eventID, userID) => {
  return axios
    .post(`/rsvp`, {
      eventID,
      userID,
    })
    .then(res => {
      return res
    })
    .catch(err => err)
}
