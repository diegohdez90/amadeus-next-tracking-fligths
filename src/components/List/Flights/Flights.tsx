import FlightDetail from '@/components/Card/Flight';
import React, { Fragment, ReactNode } from 'react'


const NoFlightFoundLabel: React.FC = () => <div><h1>Not found</h1></div>

interface Props {
  flights: [],
  limit: number
  page: number
}


const FlightList: React.FC = (props: Props) => {
  const addFlightToCart = (flightIndex) => {
    const {
      flights,
      addFlight } = props;
    addFlight(flights[flightIndex]);
  }
    const listFlights = () => {
    // const {
    // } = props.pagination;
    const {
      limit,
      page,
      flights } = props;
    const start = (page - 1) * limit;
    const list = []
    if (flights.length > 0) {
      for (let flightIndex = start; flightIndex < flights.length; flightIndex++) {
        list.push(<FlightDetail
          key={flights[flightIndex].id}
          segments={flights[flightIndex].itineraries[0].segments}
          price={flights[flightIndex].price}
          travelerPricings={flights[flightIndex].travelerPricings}
          bookFlight={addFlightToCart}
          indexFlight={flightIndex}
          disabledCancel={true}
        />);
      }
      return list;
    } else {
      return <NoFlightFoundLabel />
    }
  }

    return (
        <Fragment>
        {
            listFlights()      
        }
        </Fragment>
    )
}

export default FlightList
