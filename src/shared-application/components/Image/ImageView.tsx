/* eslint-disable @typescript-eslint/no-empty-function */
import React from "react";
import { ImageController, ImageUI } from ".";
import { Image } from "@chakra-ui/image";

export function ImageView({ controller }: { controller: ImageController }) {
  const { children, ...component } = controller.get() as ImageUI;

  const element = (
    <Image
      {...component}
      onError={() => {}}
      onClick={controller.getListener("onClick")}
    />
  );

  return element;
}
