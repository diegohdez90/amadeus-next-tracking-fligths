import Amadeus from 'amadeus-ts'
import dotenv from 'dotenv';

dotenv.config()
const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
const API_KEY=process.env.NEXT_PUBLIC_API_KEY
const API_SECRET=process.env.NEXT_PUBLIC_API_SECRET
console.log(API_KEY, API_SECRET)
const amadeus = new Amadeus({
  clientId: API_KEY,
  clientSecret: API_SECRET
})

const home = (() => {
  const nearAirports = async (params: string) => {
    const res = await fetch(`${baseUrl}/api/amadeus/airports/location?${params}`)
    if (res.ok) {
      const { data } = await res.json()
      return data.slice(0,3)
    }
    return false
  }
  const topDestinations = async (params: string) => {
    const res = await fetch(`${baseUrl}/api/amadeus/airports/destination?${params}`)
    if (res.ok) {
      const { data } = await res.json()
      return data.slice(0,3)
    }
    return false
  }

  const getFlights = async (params: string) => {
    const res = await fetch(`${baseUrl}/api/amadeus/flights?${params}`)
    if (res.ok) {
      const { data, dictionaries } = await res.json()
      return {
        data: data.slice(0,3),
        dictionaries: dictionaries
      }
    }
    return false
  }

  const getAirports = async(params: string) => {
    const res = await fetch(`${baseUrl}/api/amadeus/airports/search?${params}`)
    if (res.ok) {
      const { data } = await res.json()
      return data
    }
    return false
  }


  return {
    nearAirports,
    topDestinations,
    getFlights,
    getAirports,
  }
})()

export {amadeus , home};

