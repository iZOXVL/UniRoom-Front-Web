import React, { useState, useCallback, useRef } from 'react';
import { GoogleMap, useLoadScript, Marker, Autocomplete } from '@react-google-maps/api';

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
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
    libraries: ['places'],
  });

  const [marker, setMarker] = useState(null);
  const [address, setAddress] = useState('');
  const autocompleteRef = useRef(null);
  const mapRef = useRef(null);

  const onMapClick = useCallback((event) => {
    const coords = { lat: event.latLng.lat(), lng: event.latLng.lng() };
    setMarker(coords);
    getGeocode(coords);
  }, []);

  const getGeocode = async (coords) => {
    const response = await fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?latlng=${coords.lat},${coords.lng}&key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}`
    );
    const data = await response.json();
    if (data.results.length > 0) {
      const formattedAddress = data.results[0].formatted_address;
      setAddress(formattedAddress);
      onSelectLocation({ coords, address: formattedAddress });
    } else {
      setAddress('Dirección no encontrada');
      onSelectLocation({ coords, address: 'Dirección no encontrada' });
    }
  };

  const onPlaceSelected = () => {
    const place = autocompleteRef.current.getPlace();
    if (place && place.geometry) {
      const coords = {
        lat: place.geometry.location.lat(),
        lng: place.geometry.location.lng(),
      };
      setMarker(coords);
      mapRef.current.panTo(coords);
      mapRef.current.setZoom(17);
      setAddress(place.formatted_address);
      onSelectLocation({ coords, address: place.formatted_address });
    }
  };

  if (loadError) return <div>Error al cargar el mapa</div>;
  if (!isLoaded) return <div>Cargando...</div>;

  return (
    <div>
      <Autocomplete
        onLoad={(autocomplete) => (autocompleteRef.current = autocomplete)}
        onPlaceChanged={onPlaceSelected}
      >
        <input
          type="text"
          placeholder="Busca una dirección"
          className="input w-full mb-2 p-2 border border-gray-300 rounded"
        />
      </Autocomplete>
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        zoom={10}
        center={marker || { lat: 19.432608, lng: -99.133209 }}
        options={options}
        onClick={onMapClick}
        onLoad={(map) => (mapRef.current = map)}
      >
        {marker && <Marker position={marker} />}
      </GoogleMap>
      {address && (
        <div className="mt-2 text-sm text-dark dark:text-white">
          Dirección seleccionada: {address}
        </div>
      )}
    </div>
  );
}
