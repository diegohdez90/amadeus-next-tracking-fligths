'use client'

import { useEffect, useState } from "react";
import { home } from "./utils/amadeus";
import FlightList from "@/components/List/Flights";
import DatalistInput, {  useComboboxControls } from "react-datalist-input";
import { useDebounce } from 'use-debounce'


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


  const [dictionaries, setDictionaries] = useState<{
    aircraft: {}
    carriers: {}
    currencies: {}
    locations: {}
  }>({
     aircraft: {},
    carriers: {},
    currencies: {},
    locations: {}
  })

  const { isExpanded: isExpandedOrigin, setIsExpanded: setIsExpandedOrigin, setValue: setValueExpandedOrigin, value: valueExpandedOrigin } = useComboboxControls({ isExpanded: false });
  const [origin, setOrigin] = useState('')
  const [originDebounce] =  useDebounce(origin, 2200)
  const [originAirports, setOriginAirports] = useState([])
  const [originAirport, setOriginAirport] = useState('')

  const { isExpanded: isExpandedDestination, setIsExpanded: setIsExpandedDestination, setValue: setValueExpandedDestination, value: valueExpandedDestination } = useComboboxControls({ isExpanded: true });


  const [destination, setDestination] = useState('')


  useEffect(() => {
    if (originDebounce.length > 0) {
      console.log('origin debounce', originDebounce);
      const params = new URLSearchParams({
        term: originDebounce
      })
      const getOriginAirport = async () => {
        const data = await home.getAirports(params.toString())
        const airports = data.map(airport =>
          ({
            key: airport.iataCode,
            label: airport.name,
            id: airport.iataCode,
            value: airport.iataCode
          })
        )
        console.log(airports)
        setOriginAirports(airports)
      }
      getOriginAirport()    
    } else {
      setOriginAirports([])
    }
  }, [originDebounce])
  
  useEffect(() => {
    if (originAirports.length == 0) return
    console.log('updating orign')
    setIsExpandedOrigin(true)
  }, [originAirports]);

  useEffect(() => {
    
    
    const geolocation = (() => {
      function get(): Promise<{ pos: GeolocationPosition } | { err: string }> {
        const geo = navigator.geolocation;
      
        return new Promise((resolve, reject) => {
          if (!geo) {
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
            const res = await home.getFlights(params.toString())
            if (!res) {
              continue
            }
            const {data: resultFlight, dictionaries} = res
            setDictionaries((prev) => ({
              aircraft: {
                ...prev.aircraft,
                ...(dictionaries.aircraft ? dictionaries.aircraft : {})
              }, 
              carriers: {
                ...prev.carriers,
                ...(dictionaries.carriers ? dictionaries.carriers : {})
              },
              currencies: {
                ...prev.currencies,
                ...(dictionaries.currencies ? dictionaries.currencies: {})
              },
              locations: {
                ...prev.locations,
                ...(dictionaries.locations ? dictionaries.locations : {})
              }
            }))
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

  const onOriginInput = (e: any) => {
    const value = e.target.value
    setOrigin(value)
  }

  useEffect(() => {
    setIsExpandedOrigin(false)
  }, [origin])
  

  const selectCity = (city) => {
    setOriginAirport(city.key)
    setValueExpandedOrigin(city.key)
    setIsExpandedOrigin(false)
  }

  const onUpdateDepartureDate = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDate(e.target.value)
  }

  return (
    <div className="items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="container">
        
        <div className="flex flex-col items-center gap-4">
          <div className="flex gap-4 row-start-1 items-center flex-col sm:flex-col">
            <label>Departure Date
              <div className="flex gap-4 items-center flex-col sm:flex-col">
                { date && <input
                type='date'
                onChange={onUpdateDepartureDate}
                value={date} /> }
              </div>
            </label>
            <div className="flex gap-4 items-center flex-row">
              <div className="flex">
                <DatalistInput
                  placeholder='Select origin'
                  onSelect={selectCity}
                  onInput={onOriginInput}
                  value={origin}
                  items={originAirports}
                  label='Origin'
                  isExpanded={isExpandedOrigin}
                  setIsExpanded={setIsExpandedOrigin}
                />
              </div>
              <div className="flex">
                {new String(isExpandedOrigin)}
              </div>

  
            </div>
          </div>


          <div>
            <FlightList flights={flights} page={1} limit={10} dictionaries={dictionaries} />
          </div>
        </div>
      </main>
      <footer className="row-start-3 flex gap-6 flex-wrap items-center justify-center">
        
      </footer>
    </div>
  );
}
