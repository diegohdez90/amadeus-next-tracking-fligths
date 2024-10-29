'use client'

import Image from "next/image";
import { useEffect } from "react";
import { home as locationData } from "./utils/amadeus";

export default function Home() {

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
          
          // Use latitude and longitude here as needed
          const params = new URLSearchParams({
            latitude: latitude.toString(),
            longitude: longitude.toString()
          });

          console.log("URL Params:", params.toString());
          const airports = await locationData.nearAirports(params.toString())

          console.log(airports);
          const rootFlights = []
          for (let airport of airports) {
            const params = new URLSearchParams({
              departureAirportCode: airport.iataCode,
              max: '2'
            })
            const destinations = await locationData.topDestinations(params.toString())
            for (let destination of destinations) {
              rootFlights.push({
                origin: airport.iataCode,
                departure: destination.iataCode
              })
            }
          }
          console.log(rootFlights)

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

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
        
        <div className="flex gap-4 items-center flex-col sm:flex-row">
          {/* <p>{`Your location is ${pos?.coords.altitude} ${pos?.coords.latitude}`}</p> */}
        </div>
      </main>
      <footer className="row-start-3 flex gap-6 flex-wrap items-center justify-center">
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://nextjs.org/learn?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/file.svg"
            alt="File icon"
            width={16}
            height={16}
          />
          Learn
        </a>
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://vercel.com/templates?framework=next.js&utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/window.svg"
            alt="Window icon"
            width={16}
            height={16}
          />
          Examples
        </a>
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://nextjs.org?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/globe.svg"
            alt="Globe icon"
            width={16}
            height={16}
          />
          Go to nextjs.org →
        </a>
      </footer>
    </div>
  );
}
