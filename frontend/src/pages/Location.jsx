import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, CircleMarker } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import "../styles/Location.css";

// Fix Leaflet default icon issue
const diamondIcon = L.divIcon({
  className: "custom-diamond-icon",
  html: `<div class="diamond"></div>`,
  iconSize: [40, 40],
  iconAnchor: [20, 20],
  popupAnchor: [0, -20],
});

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
});

// Haversine formula to calculate distance (km)
const haversineDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  return R * (2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)));
};

const Location = () => {
  const [vendors, setVendors] = useState([]);
  const [filter, setFilter] = useState(null); // <- initially no filter

  const userLocation = [12.9716, 77.5946]; // Bangalore

  useEffect(() => {
    const fetchVendors = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/vendors");
        const data = await res.json();
        setVendors(data);
      } catch (err) {
        console.error("Error fetching vendors:", err);
      }
    };
    fetchVendors();
  }, []);

  const matchesFilter = (vendor) => {
    if (!filter) return false; // no animation if filter not chosen

    const lat = vendor.storeCoordinates.coordinates[1];
    const lon = vendor.storeCoordinates.coordinates[0];
    const distance = haversineDistance(
      userLocation[0],
      userLocation[1],
      lat,
      lon
    );

    switch (filter) {
      case "5km":
        return distance <= 5;
      case "10km":
        return distance <= 10;
      case "20km":
        return distance <= 20;
      case "over20":
        return distance > 20;
      default:
        return false;
    }
  };

  return (
    <div className="location-page">
      <div className="sidebar">
        <h3>Filters | 種類</h3>
        <ul>
          <li onClick={() => setFilter("5km")}>Under 5 km</li>
          <li onClick={() => setFilter("10km")}>Under 10 km</li>
          <li onClick={() => setFilter("20km")}>Under 20 km</li>
          <li onClick={() => setFilter("over20")}>Over 20 km</li>
          <li onClick={() => setFilter(null)}>Show All (no ripple)</li>
        </ul>
      </div>

      <div className="map-wrapper">
        <h2 className="map-title">🗺️ Eco Stores Near You | お近くのエコストア</h2>
        <MapContainer center={userLocation} zoom={6} className="map-container">
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution="&copy; OpenStreetMap contributors"
          />

          {vendors.map((vendor, idx) => {
            const lat = vendor.storeCoordinates.coordinates[1];
            const lon = vendor.storeCoordinates.coordinates[0];
            const highlight = matchesFilter(vendor);

            return (
              <React.Fragment key={idx}>
                <Marker position={[lat, lon]}>
                  <Popup>
                    <div className="popup-animated">
                      <h3>{vendor.storeName}</h3>
                      <p>{vendor.storeAddress}</p>
                      <p>📞 {vendor.storeContact}</p>
                    </div>
                  </Popup>
                </Marker>

                {highlight && (
                  <CircleMarker
                    center={[lat, lon]}
                    radius={20}
                    pathOptions={{ color: "black", fillOpacity: 0 }}
                    className="ripple-circle"
                  />
                )}
              </React.Fragment>
            );
          })}
        </MapContainer>
      </div>
    </div>
  );
};

export default Location;
