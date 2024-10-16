import React, { useState, useCallback } from 'react';
import { GoogleMap, useLoadScript, Marker } from '@react-google-maps/api';

const mapContainerStyle = {
  width: '100%',
  height: '220px',
};

const options = {
  disableDefaultUI: true,
  zoomControl: true,
};

export default function Map({ onSelectLocation }) {
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY, // Asegúrate de configurar tu API Key en .env.local
  });

  const [marker, setMarker] = useState(null);

  const onMapClick = useCallback((event) => {
    const coords = { lat: event.latLng.lat(), lng: event.latLng.lng() };
    setMarker(coords);
    onSelectLocation(coords);
    // Aquí podrías hacer una llamada a la API de geocodificación para obtener la dirección
    getGeocode(coords);
  }, [onSelectLocation]);

  const getGeocode = async (coords) => {
    const response = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${coords.lat},${coords.lng}&key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}`);
    const data = await response.json();
    if (data.results.length > 0) {
      console.log('Dirección:', data.results[0].formatted_address);
      // Aquí puedes almacenar o mostrar la dirección como desees
    } else {
      console.log('No se encontró dirección para las coordenadas');
    }
  };

  if (loadError) return <div>Error al cargar el mapa</div>;
  if (!isLoaded) return <div>Cargando...</div>;

  return (
    <GoogleMap
      mapContainerStyle={mapContainerStyle}
      zoom={10}
      center={marker || { lat: 19.432608, lng: -99.133209 }} // Ciudad de México como centro
      options={options}
      onClick={onMapClick}
    >
      {marker && <Marker position={marker} />}
    </GoogleMap>
  );
}
