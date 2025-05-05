import React, { useEffect, useState, useRef } from "react"
import axios from "axios"
import { Row, Col, Card, CardBody, CardTitle, CardSubtitle } from "reactstrap"
import Breadcrumbs from "../../components/Common/Breadcrumb"
import mapboxgl from 'mapbox-gl'
import 'mapbox-gl/dist/mapbox-gl.css'

// Set Mapbox access token from environment variables
mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN

const MapboxMap = () => {
  // meta title
  document.title = "Mapbox Map | Parkini - Back Office";

  const [parkings, setParkings] = useState([])
  const mapContainer = useRef(null)
  const map = useRef(null)
  const popupRef = useRef(new mapboxgl.Popup({ 
    offset: 25,
    closeButton: true,
    closeOnClick: false,
    maxWidth: '300px'
  }))

  // Fetch parking locations from backend
  useEffect(() => {
    axios.get("http://localhost:3001/parkings/parkings")
      .then(response => {
        setParkings(response.data)
      })
      .catch(error => console.error("Error fetching parking data:", error))
  }, [])

  // Initialize map when component mounts
  useEffect(() => {
    if (map.current) return; // Initialize map only once

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v12',
      center: [9.5375, 33.8869], // Tunisia center [lng, lat]
      zoom: 6.5
    });

    // Add navigation controls
    map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');

    // Clean up on unmount
    return () => map.current?.remove();
  }, []);

  // Add markers to map when parkings data is loaded
  useEffect(() => {
    if (!map.current || !parkings.length) return;
    
    // Clear existing markers if any
    const markersElements = document.getElementsByClassName('custom-marker');
    while (markersElements.length > 0) {
      markersElements[0].remove();
    }

    const addMarkers = () => {
      parkings.forEach(parking => {
        // Create custom marker element
        const el = document.createElement('div');
        el.className = 'custom-marker';
        el.style.width = '25px';
        el.style.height = '25px';
        el.style.backgroundImage = 'url(https://img.icons8.com/color/48/000000/parking.png)';
        el.style.backgroundSize = 'cover';
        el.style.cursor = 'pointer';
        
        // Add availability status indicator
        const statusDot = document.createElement('div');
        statusDot.className = 'status-dot';
        statusDot.style.position = 'absolute';
        statusDot.style.top = '-5px';
        statusDot.style.right = '-5px';
        statusDot.style.width = '12px';
        statusDot.style.height = '12px';
        statusDot.style.borderRadius = '50%';
        statusDot.style.border = '1px solid white';
        
        // Determine availability color
        const availability = parking.availableSpots / parking.totalSpots;
        if (availability > 0.5) {
          statusDot.style.backgroundColor = '#2ECC71'; // Green for high availability
        } else if (availability > 0.2) {
          statusDot.style.backgroundColor = '#F39C12'; // Orange for medium availability
        } else {
          statusDot.style.backgroundColor = '#E74C3C'; // Red for low availability
        }
        
        el.appendChild(statusDot);
        
        // Create marker
        new mapboxgl.Marker(el)
          .setLngLat([parking.position.lng, parking.position.lat])
          .addTo(map.current);
          
        // Add click event to show popup
        el.addEventListener('click', () => {
          // Format pricing information
          const pricing = parking.pricing ? `
            <div class="pricing-info">
              <p><strong>Pricing:</strong></p>
              <p>Hourly: ${parking.pricing.hourly} DT</p>
              <p>Daily: ${parking.pricing.daily} DT</p>
            </div>
          ` : '';
          
          // Create popup HTML content
          const popupContent = `
            <div class="parking-popup">
              <h4>${parking.name}</h4>
              <p><strong>Availability:</strong> ${parking.availableSpots}/${parking.totalSpots} spots</p>
              ${pricing}
              <p><strong>Features:</strong> ${(parking.features || []).join(', ')}</p>
              
            </div>
          `;
          
          // Show popup
          popupRef.current
            .setLngLat([parking.position.lng, parking.position.lat])
            .setHTML(popupContent)
            .addTo(map.current);
            
          // Add event listener to view details button
          setTimeout(() => {
            const detailsBtn = document.querySelector('.btn-view-details');
            if (detailsBtn) {
              detailsBtn.addEventListener('click', () => {
                // Redirect to parking details page
                window.location.href = `/parking/details/${parking._id}`;
              });
            }
          }, 100);
        });
      });
    };

    // Add markers when map is loaded
    if (map.current.loaded()) {
      addMarkers();
    } else {
      map.current.on('load', addMarkers);
    }
  }, [parkings]);

  return (
    <React.Fragment>
      <div className="page-content">
        <div className="container-fluid">
          <Breadcrumbs title="Maps" breadcrumbItem="Parking Locations" />

          <Row>
            <Col lg={12}>
              <Card>
                <CardBody>
                  <CardTitle>Parking Locations</CardTitle>
                  <CardSubtitle className="mb-3">Displaying all parkings on the map.</CardSubtitle>
                  
                  <div 
                    ref={mapContainer} 
                    className="map-container" 
                    style={{ 
                      position: "relative", 
                      height: "500px", 
                      borderRadius: "8px",
                      overflow: "hidden" 
                    }}
                  />
                </CardBody>
              </Card>
            </Col>
          </Row>
        </div>
      </div>
    </React.Fragment>
  )
}

export default MapboxMap
