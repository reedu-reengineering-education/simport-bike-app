"use client";
import * as React from "react";
import Map, { Marker } from "react-map-gl/maplibre";

export default function MapComponent() {
  return (
    <div className="h-full w-full">
      {" "}
      <Map
        initialViewState={{
          longitude: 7.629040078544051,
          latitude: 51.95991276754322,
          zoom: 14,
          pitch: 45,
        }}
        mapStyle="https://api.maptiler.com/maps/streets/style.json?key=DT8RRRX6sOuzQrcuhKuE"
      ></Map>
    </div>
  );
}
