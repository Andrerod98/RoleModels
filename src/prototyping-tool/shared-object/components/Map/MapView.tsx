import { UIComponentView } from "../UIComponent/UIComponentView";
import { MapUI } from "./MapModel";
import GoogleMapReact from "google-map-react";
import React from "react";
import { Box } from "@chakra-ui/react";

export class MapView extends UIComponentView {
  render() {
    const component = this.props.controller.get() as MapUI;

    return (
      <Box {...component}>
        <GoogleMapReact
          onChange={this.props.controller.getListener("onChange")}
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
}
