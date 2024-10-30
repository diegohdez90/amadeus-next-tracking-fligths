'use client'

import { useEffect, useState } from "react";
import { Dropdown, DropdownHeader } from 'flowbite-react';
import { home } from "./utils/amadeus";
import FlightList from "@/components/List/Flights";

export default function Home() {
  const now = new Date();

  if (now.getHours() >= 18) {
    // Move dateObj to the next day
    now.setDate(now.getDate() + 1);
  }
  // Format the date as "YYYY-MM-DD" in local time
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed, so we add 1
  const day = String(now.getDate()).padStart(2, '0');

  // Combine to get the formatted date
  const formattedDate = `${year}-${month}-${day}`;
  const [date, setDate] = useState(formattedDate)
  const [flights, setFlights] = useState([])
  useEffect(() => {
    const geolocation = (() => {
      function get(): Promise<{ pos: GeolocationPosition } | { err: string }> {
        const geo = navigator.geolocation;
      
        return new Promise((resolve, reject) => {
          if (!geo) {
            console.error("Geolocation is not supported by this browser.");
            reject({ err: "Geolocation is not supported by this browser." });
          } else {
            geo.getCurrentPosition((pos) => {
              resolve({
                pos: pos
              })
            }, (err) => {
              reject({
                  err: err.message
              })
            }, {
              enableHighAccuracy: true,
              maximumAge: 0,
              timeout: 10000
            })
          }
        })
      }
      return {
        get
      }
    })()
  
    const fetchLocation = async () => {
      try {
        const result = await geolocation.get();
        
        if ('pos' in result) {
          
          const { latitude, longitude } = result.pos.coords;

          
          const params = new URLSearchParams({
            latitude: latitude.toString(),
            longitude: longitude.toString()
          });

          const airports = await home.nearAirports(params.toString())

          const rootFlights = []
          for (const airport of airports) {
            const params = new URLSearchParams({
              departureAirportCode: airport.iataCode,
              max: '2'
            })
            const destinations = await home.topDestinations(params.toString())
            for (const destination of destinations) {
              rootFlights.push({
                origin: airport.iataCode,
                destination: destination.iataCode
              })
            }
          }
          console.log(rootFlights)
          const amadeusFlights = []
          for (const flight of rootFlights) {
            const params = new URLSearchParams({
              originLocationCode: flight.origin,
              destinationLocationCode: flight.destination,
              departureDate: date,
              adults: '1',
            })
            const resultFlight = await home.getFlights(params.toString())
            setFlights((prev) => [...prev, ...resultFlight])
          }
          console.log(amadeusFlights)
          
        }
        return false
      } catch (err) {
        if (typeof err === 'object' && err && 'err' in err) {
          return false
        }
        return false
      }
    };

    // fetchLocation()
  }, [])

  const onUpdateDepartureDate = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDate(e.target.value)
  }

  return (
    <div className="items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="container">
        
        <div className="grid grid-rows-2 items-center gap-4">
          <div className="flex gap-4 row-start-1 items-center flex-col sm:flex-col">
            <div className="flex gap-4 items-center flex-col sm:flex-col">
              <input
              type='date'
              onChange={onUpdateDepartureDate}
              value={date} />
            </div>
            <div className="flex gap-4 items-center flex-row">
              <div className="flex">
                <label htmlFor="search-dropdown" className="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white">Your Email</label>

                <div className="relative w-full">
                    <input type="search" id="search-dropdown" className="block p-2.5 w-full z-20 text-sm text-gray-900 bg-gray-50 rounded-lg border-all-gray-50 border-s-2 border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-s-gray-700  dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:border-blue-500" placeholder="Search Mockups, Logos, Design Templates..." required />
                    <button type="submit" className="absolute top-0 end-0 p-2.5 text-sm font-medium h-full text-white bg-blue-700 rounded-e-lg border border-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                        <svg className="w-4 h-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"/>
                        </svg>
                        <span className="sr-only">Search</span>
                    </button>
                </div>
              </div>
              <div className="flex">
                <label htmlFor="search-dropdown" className="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white">Your Email</label>

                <div className="relative w-full">
                    <input type="search" id="search-dropdown" className="block p-2.5 w-full z-20 text-sm text-gray-900 bg-gray-50 rounded-lg border-all-gray-50 border-s-2 border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-s-gray-700  dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:border-blue-500" placeholder="Search Mockups, Logos, Design Templates..." required />
                    <button type="submit" className="absolute top-0 end-0 p-2.5 text-sm font-medium h-full text-white bg-blue-700 rounded-e-lg border border-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                        <svg className="w-4 h-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"/>
                        </svg>
                        <span className="sr-only">Search</span>
                    </button>
                </div>
              </div>

  
            </div>
          </div>


          <div>
            <FlightList flights={flights} page={1} limit={10} />
          </div>
        </div>
      </main>
      <footer className="row-start-3 flex gap-6 flex-wrap items-center justify-center">
        
      </footer>
    </div>
  );
}
