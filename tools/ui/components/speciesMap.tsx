import { LatLngExpression } from 'leaflet';
import { MapContainer, Marker, Popup, TileLayer, GeoJSON } from 'react-leaflet';
import "leaflet/dist/leaflet.css";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css";
import "leaflet-defaulticon-compatibility";


const SpeciesMap = ({ geojson, latinName, englishName }: { geojson: any | null, latinName: string, englishName: string }) => {
  const position: LatLngExpression = [0, 0]
  console.log(geojson)
  return (
    <MapContainer center={position} zoom={3} scrollWheelZoom={true} className="w-full h-full">
      {geojson ? (<GeoJSON
        attribution={`${englishName} (${latinName})`}
        data={geojson}

      />) : null}
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {/* <Marker position={position}>
        <Popup>
          A pretty CSS3 popup. <br /> Easily customizable.
        </Popup>
      </Marker> */}

    </MapContainer>
  )
}

export default SpeciesMap;