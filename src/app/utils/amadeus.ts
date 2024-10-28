import Amadeus from 'amadeus-ts'
import { API_KEY, API_SECRET } from './config'

const amadeus = new Amadeus({
  clientId: API_KEY,
  clientSecret: API_SECRET
})

const home = (() => {
  const nearAirports = async (params: string) => {
    const res = await fetch(`/api/amadeus/airports/location?${params}`)
    if (res.ok) {
      const { data } = await res.json()
      return data
    }
    return false
  }
  const topDestinations = () => {}

  return {
    nearAirports,
    topDestinations
  }
})()

export {amadeus as default, home};

