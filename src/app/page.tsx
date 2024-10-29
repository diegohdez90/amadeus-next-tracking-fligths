'use client'

import { useEffect, useState } from "react";
import { home as locationData } from "./utils/amadeus";
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
        console.log(result);
        
        if ('pos' in result) {
          console.log('using pos');
          
          const { latitude, longitude } = result.pos.coords;

          console.log(latitude, longitude);
          
          const params = new URLSearchParams({
            latitude: latitude.toString(),
            longitude: longitude.toString()
          });

          const airports = await locationData.nearAirports(params.toString())

          const rootFlights = []
          for (const airport of airports) {
            const params = new URLSearchParams({
              departureAirportCode: airport.iataCode,
              max: '2'
            })
            const destinations = await locationData.topDestinations(params.toString())
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
            const resultFlight = await locationData.getFlights(params.toString())
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

    fetchLocation()
  }, [])

  const onUpdateDepartureDate = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDate(e.target.value)
  }

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
        
        <div className="flex gap-4 items-center flex-col sm:flex-row">
          <input
            type='date'
            onChange={onUpdateDepartureDate}
            value={date} />
          {date}

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
