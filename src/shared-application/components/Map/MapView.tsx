import { MapUI } from "./MapModel";
import GoogleMapReact from "google-map-react";
import React from "react";
import { Box } from "@chakra-ui/react";
import { MapController } from "./MapController";

export function MapView({ controller }: { controller: MapController }) {
  const { children, ...component } = controller.get() as MapUI;

  return (
    <Box {...component}>
      <GoogleMapReact
        onChange={({ center, zoom }) =>
          controller.update({
            ...component,
            center: center,
            zoom: zoom,
            children: [],
          })
        }
        /* onChange={({ center, zoom }) => {
            this.handleChange({ center, zoom });
          }}*/
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
      />
    </Box>
  );
}
