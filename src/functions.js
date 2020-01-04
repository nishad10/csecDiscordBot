import axios from 'axios'

axios.defaults.baseURL = 'https://utacsecapi.herokuapp.com'
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
