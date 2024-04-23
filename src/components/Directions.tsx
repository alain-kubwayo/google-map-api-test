import { useEffect, useState } from 'react'
import { useMap, useMapsLibrary } from '@vis.gl/react-google-maps'

const Directions = () => {
  const map = useMap()
  const routesLibrary = useMapsLibrary('routes')
  const [directionsService, setDirectionsService] =
    useState<google.maps.DirectionsService>()
  const [directionsRenderer, setDirectionsRenderer] =
    useState<google.maps.DirectionsRenderer>()
  const [routes, setRoutes] = useState<google.maps.DirectionsRoute[]>([])
  const [routeIndex, setRouteIndex] = useState(0)
  const [driverPosition, setDriverPosition] = useState<string>('Nyabugogo')
  const [waypoints, setWaypoints] = useState<any[]>([])
  const selected = routes[routeIndex]
  const leg = selected?.legs[0]

  useEffect(() => {
    if (!routesLibrary || !map) return
    setDirectionsService(new routesLibrary.DirectionsService())
    setDirectionsRenderer(new routesLibrary.DirectionsRenderer({ map }))
  }, [routesLibrary, map])

  useEffect(() => {
    if (!directionsService || !directionsRenderer) return

    const origin = { lat: -1.939826787816454, lng: 30.0445426438232 }
    const destination = { lat: -1.9365670876910166, lng: 30.13020167024439 }
    const waypointsData = [
      {
        location: { lat: -1.9355377074007851, lng: 30.060163829002217 },
        name: 'Stop A',
      },
      {
        location: { lat: -1.9358808342336546, lng: 30.08024820994666 },
        name: 'Stop B',
      },
      {
        location: { lat: -1.9489196023037583, lng: 30.092607828989397 },
        name: 'Stop C',
      },
      {
        location: { lat: -1.9592132952818164, lng: 30.106684061788073 },
        name: 'Stop D',
      },
      {
        location: { lat: -1.9487480402200394, lng: 30.126596781356923 },
        name: 'Stop E',
      },
    ]

    setWaypoints(waypointsData)

    directionsService
      .route({
        origin,
        destination,
        waypoints: waypointsData.map((waypoint) => ({
          location: waypoint.location,
          stopover: true,
        })),
        travelMode: google.maps.TravelMode.DRIVING,
        provideRouteAlternatives: true,
      })
      .then((response) => {
        directionsRenderer.setDirections(response)
        setRoutes(response.routes)
      })
      .catch((error) => {
        console.error('Error fetching directions:', error)
      })

    return () => directionsRenderer.setMap(null)
  }, [directionsService, directionsRenderer])

  useEffect(() => {
    if (!directionsRenderer) return
    directionsRenderer.setRouteIndex(routeIndex)
  }, [routeIndex, directionsRenderer])

  useEffect(() => {
    if (!leg) return

    const totalDistance = leg.distance.value
    const currentPositionDistance = Math.random() * totalDistance
    let coveredDistance = 0
    let currentStep = 0

    for (const step of leg.steps) {
      coveredDistance += step.distance.value
      if (coveredDistance >= currentPositionDistance) {
        setDriverPosition(
          `Between ${waypoints[currentStep].name} and ${
            waypoints[currentStep + 1].name
          }`
        )
        break
      }
      currentStep++
    }
  }, [leg, waypoints])

  if (!leg) return null

  return (
    <div>
      <div id='map' style={{ height: '400px', width: '100%' }}></div>
      <div
        style={{
          position: 'absolute',
          top: '10px',
          left: '40%',
          backgroundColor: 'white',
          padding: '10px',
        }}
      >
        <h2 className='text-center text-black'>Driver Information</h2>
        <p>
          Current Position: <span className='text-black'>{driverPosition}</span>
        </p>
        <p>
          Next Stop:{' '}
          <span className='text-black'>
            {waypoints.length > 1 ? waypoints[1].name : 'Unknown'}
          </span>
        </p>
        <p>
          Next Stop Distance:{' '}
          <span className='text-black'>
            {leg.steps.length > 1 ? leg.steps[1]?.distance?.text : 'Unknown'}
          </span>
        </p>
        <p>
          Next Stop ETA:{' '}
          <span className='text-black'>
            {leg.steps.length > 1 ? leg.steps[1]?.duration?.text : 'Unknown'}
          </span>
        </p>
      </div>
    </div>
  )
}

export default Directions
