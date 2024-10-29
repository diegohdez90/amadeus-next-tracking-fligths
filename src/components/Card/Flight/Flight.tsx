import React, { Fragment } from 'react';

import moment from 'moment';

interface Props {
  bookFlight: (id: number) => void
  indexFlight: any
  segments: []
  price: any
  travelerPricings: any
  disabledBook: any
  removeFromList: any
  disabledCancel: any
}


const FlightDetail: React.FC<Props> = ({
  bookFlight,
  indexFlight,
  segments,
  price,
  travelerPricings,
  disabledBook,
  removeFromList,
  disabledCancel,
}: Props) => {
  return (
    <Fragment>
      <div className="p-10">
        <div className="max-w-full content-center bg-white flex flex-col rounded overflow-hidden shadow-lg">
          <div className="flex flex-row items-baseline flex-nowrap bg-gray-100 p-2">
            {!disabledCancel && <button
              className="rounded-full bg-red-600 text-slate-100 p-2"
              onClick={(e) => {
                e.preventDefault();
                removeFromList(indexFlight);
              }}
            >Remove from cart</button> }
            <h1 className="ml-2 uppercase font-bold text-gray-500">departure</h1>
            <p className="ml-2 font-normal text-gray-500">{new moment(segments[0].departure.at).format('dddd, MMMM Do')}</p>
          </div>
          {
            segments.map((seg, indexSeg) => (
              <Fragment key={indexSeg}>
                <div className="mt-2 flex justify-start bg-white p-2">
                  <div className="flex mx-2 ml-6 h8 px-2 flex-row items-baseline rounded-full bg-gray-100 p-1">
                    <p className="font-normal text-sm ml-1 text-gray-500">{travelerPricings[0].fareDetailsBySegment[indexSeg].cabin}</p>
                  </div>
                </div>
                <div className="mt-2 flex sm:flex-row mx-6 sm:justify-between flex-wrap ">
                  <div className="flex flex-row place-items-center p-2">
                    <div className="flex flex-col ml-2">
                      <p className="text-xs text-gray-500 font-bold"></p>
                      {/* {dictionary.carriers[seg.carrierCode]} */}
                      <p className="text-xs text-gray-500">{`${seg.aircraft.code} - `}</p>
                      {/* ${dictionary.aircraft[seg.aircraft.code]} */}
                    </div>
                  </div>

                  <div className="flex flex-col p-2">
                    <p className="font-bold">{new moment(seg.departure.at).format('dddd, MMMM Do YYYY, h:mm:ss a')}</p>
                    <p className="text-gray-500"><span className="font-bold">{seg.departure.iataCode}</span></p>
                  </div>
                  <div className="flex flex-col flex-wrap p-2">
                    <p className="font-bold">{new moment(seg.arrival.at).format('dddd, MMMM Do YYYY, h:mm:ss a')}</p>
                    <p className="text-gray-500"><span className="font-bold">{seg.arrival.iataCode}</span></p>
                  </div>
                </div>
              </Fragment>
            ))
          }
          <div className="mt-4 bg-gray-100 flex flex-row flex-wrap md:flex-nowrap justify-between items-baseline">
            <div className="flex mx-6 py-4 flex-row flex-wrap">
            </div>
            <div className="md:border-l-2 mx-6 md:border-dotted flex flex-row py-4 mr-6 flex-wrap">
              <div className="text-sm mx-2 flex flex-col">
                <p>Flexible Ticket</p>
                <p className="font-bold">{price.currency} {price.total}</p>
                <p className="text-xs text-gray-500">{travelerPricings[0].travelerType}</p>
              </div>
              {
                !disabledBook &&
                <button className="w-32 h-11 rounded flex border-solid border text-white bg-green-800 mx-2 justify-center place-items-center" onClick={(e) => { e.preventDefault(); bookFlight(indexFlight) }}><div className="">Book</div></button>
              }
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  )
}

export default FlightDetail;

