"use client";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
// import { MapContainer, TileLayer, CircleMarker, Tooltip } from "react-leaflet";
import {Props} from "../ref/types"

const MapContainer = dynamic(
  () => import("react-leaflet").then(mod => mod.MapContainer),
  { ssr: false }
);
const TileLayer = dynamic(
  () => import("react-leaflet").then(mod => mod.TileLayer),
  { ssr: false }
);
const CircleMarker = dynamic(
  () => import("react-leaflet").then(mod => mod.CircleMarker),
  { ssr: false }
);
const Tooltip = dynamic(
  () => import("react-leaflet").then(mod => mod.Tooltip),
  { ssr: false }
);



export default function GeoMapLeaflet({ data }: Props) {
         const [isClient, setIsClient] = useState(false);

  // Evita errori "window is not defined" durante SSR
             useEffect(() => setIsClient(true), []);

        if (!data || data.length === 0)
            return <p className="text-center text-gray-500">Nessun dato disponibile</p>;
          if (!isClient) return <p>🗺️ Caricamento mappa...</p>;
        // scala colore semplice (blu -> giallo -> rosso)

        const colorScale = (value: number) => {
        const ratio = Math.min(value / 500000, 1);
        const hue = (1 - ratio) * 240; // blu → rosso
        return `hsl(${hue}, 100%, 50%)`;
        };


        return (
        <>
                <MapContainer
                center={[36.5, -119.5]} 
                zoom={6}
                scrollWheelZoom={false}
                style={{ height: "700px", width: "100%", borderRadius: "12px", zIndex:"revert" }}
                >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a>'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                {data.map((p, idx) => (
                    <CircleMarker
                    key={idx}
                    center={[p.latitude, p.longitude]}
                    radius={2}
                    color={colorScale(p.median_house_value)}
                    fillOpacity={0.9}
                    >
                    <Tooltip direction="top" offset={[0, -2]} opacity={1}>
                        <div>
                        <strong>Valore:</strong> ${p.median_house_value.toLocaleString("it-IT")}
                        <br />
                        <span>Lat: {p.latitude.toFixed(2)}, Lon: {p.longitude.toFixed(2)}</span>
                        </div>
                    </Tooltip>
                    </CircleMarker>
                ))}
                </MapContainer>
                <div className="flex justify-center gap-4 text-sm text-gray-600 mt-3">
                    <span className="flex items-center gap-1">
                        <span className="w-4 h-4 bg-blue-600 rounded-full inline-block"></span> Case economiche
                    </span>
                    <span className="flex items-center gap-1">
                        <span className="w-4 h-4 bg-yellow-400 rounded-full inline-block"></span> Prezzo medio
                    </span>
                    <span className="flex items-center gap-1">
                        <span className="w-4 h-4 bg-red-600 rounded-full inline-block"></span> Case costose
                    </span>
                </div>
        </>
        );
}
