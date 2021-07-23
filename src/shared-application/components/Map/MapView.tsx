import { MapUI } from "./MapModel";
import GoogleMapReact from "google-map-react";
import React from "react";
import { Box } from "@chakra-ui/react";
import { MapController } from "./MapController";
import { UIComponentController } from "..";

export function MapView({ controller }: { controller: MapController }) {
  const { children, ...component } = controller.get() as MapUI;

  return (
    <Box {...component} key={"map-box-" + component.id}>
      <GoogleMapReact
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
      </GoogleMapReact>
    </Box>
  );
}
