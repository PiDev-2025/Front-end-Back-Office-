import PropTypes from 'prop-types'
import React, { useEffect, useState } from "react"
import { Map, InfoWindow, Marker, GoogleApiWrapper } from "google-maps-react"
import axios from "axios"
import { connect } from "react-redux"
import { Row, Col, Card, CardBody, CardTitle, CardSubtitle } from "reactstrap"
import Breadcrumbs from "../../components/Common/Breadcrumb"

const LoadingContainer = () => <div>Loading...</div>

const MapsGoogle = props => {
  // meta title
  document.title = "Google Maps | Skote - Vite React Admin & Dashboard Template";

  const [parkings, setParkings] = useState([])  // Store parking locations
  const [selectedPlace, setSelectedPlace] = useState(null) // Store selected parking for InfoWindow

  // Fetch parking locations from backend
  useEffect(() => {
    axios.get("http://localhost:3001/parkings/parkings") // Adjust the API URL if necessary
      .then(response => {
        setParkings(response.data) // Set the parking locations
      })
      .catch(error => console.error("Error fetching parking data:", error))
  }, [])

  // Handle marker click
  const onMarkerClick = (parking) => {
    setSelectedPlace(parking)
  }

  return (
    <React.Fragment>
      <div className="page-content">
        <div className="container-fluid">
          <Breadcrumbs title="Maps" breadcrumbItem="Google Maps" />

          <Row>
            <Col lg={12}>
              <Card>
                <CardBody>
                  <CardTitle>Parking Locations</CardTitle>
                  <CardSubtitle className="mb-3">Displaying all parkings on the map.</CardSubtitle>
                  
                  <div id="gmaps-markers" className="gmaps" style={{ position: "relative", height: "500px" }}>
                    <Map
                      google={props.google}
                      style={{ width: "100%", height: "100%" }}
                      zoom={7} // Adjust zoom level for Tunisia
                      initialCenter={{ lat: 33.8869, lng: 9.5375 }} // Default center (Tunisia)
                    >
                      {parkings.map((parking, index) => (
                        <Marker
                          key={index}
                          position={{ lat: parking.position.lat, lng: parking.position.lng }}
                          onClick={() => onMarkerClick(parking)}
                        />
                      ))}

                      {/* Display InfoWindow for selected marker */}
                      {selectedPlace && (
                        <InfoWindow
                          position={{ lat: selectedPlace.position.lat, lng: selectedPlace.position.lng }}
                          visible={true}
                          onClose={() => setSelectedPlace(null)}
                        >
                          <div>
                            <h5>{selectedPlace.name}</h5>
                            <p>Available spots: {selectedPlace.availableSpots}</p>
                          </div>
                        </InfoWindow>
                      )}
                    </Map>
                  </div>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </div>
      </div>
    </React.Fragment>
  )
}

MapsGoogle.propTypes = {
  google: PropTypes.object
}

export default connect(
  null,
  {}
)(
  GoogleApiWrapper({
    apiKey: "AIzaSyALhgiV1Mi4IQdr-RPmCIFKli_7rhGDbm0",
    LoadingContainer: LoadingContainer,
    v: "3",
  })(MapsGoogle)
)
