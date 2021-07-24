import { MapUI } from "./MapModel";
import React from "react";
import { Box } from "@chakra-ui/react";
import { MapController } from "./MapController";
import { Map, Marker, Point, ZoomControl } from "pigeon-maps";
import {
  osm,
  stamenTerrain,
  stamenToner,
  maptiler,
} from "pigeon-maps/providers";
export function MapView({ controller }: { controller: MapController }) {
  const { children, ...component } = controller.get() as MapUI;

  return (
    <Box {...component} key={"map-box-" + component.id}>
      <Map
        defaultCenter={[component.center.lat, component.center.lng]}
        defaultZoom={component.zoom}
        animate={true}
        provider={
          component.type == "osm"
            ? osm
            : component.type == "stamenTerrain"
            ? stamenTerrain
            : component.type == "stamenToner"
            ? stamenToner
            : osm
        }
        center={[component.center.lat, component.center.lng]}
        zoom={component.zoom}
        onBoundsChanged={({ center, zoom }) => {
          const [lat, lng] = center;
          const newCenter = { lat: lat, lng: lng };
          controller.emitEvent("onChange", { newCenter, zoom });
          controller.update({
            ...component,
            center: newCenter,
            zoom: zoom,
            children: children,
          });
        }}
      >
        <ZoomControl />
        <Marker width={50} anchor={[50.879, 4.6997]} />
      </Map>
      {/*<GoogleMapReact
        key={"map-" + component.id}
        onChange={({ center, zoom }) => {
          controller.emitEvent("onChange", { center, zoom });
          controller.update({
            ...component,
            center: center,
            zoom: zoom,
            children: children,
          });
        }}
        bootstrapURLKeys={{ key: "" }}
        defaultCenter={component.center}
        center={component.center}
        options={(map) => ({
          mapTypeId:
            component.type == "satelite"
              ? map.MapTypeId.SATELLITE
              : component.type == "hybrid"
              ? map.MapTypeId.HYBRID
              : map.MapTypeId.ROADMAP,
        })}
        defaultZoom={component.zoom}
        zoom={component.zoom}
      >
        {controller.getChildren().map((component: any) => (
          <Box lat={component.get().lat} lng={component.get().lng}>
            {component.generateWidget()}
          </Box>
        ))}
        </GoogleMapReact>*/}
    </Box>
  );
}
