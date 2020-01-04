import axios from 'axios'

axios.defaults.baseURL = 'https://utacsecapi.herokuapp.com'

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
