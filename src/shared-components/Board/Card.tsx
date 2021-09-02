import React from "react";
import { Image } from "@chakra-ui/react";
interface CardProps {
  value: string;
  onClick?: () => void;
  isBack?: boolean;

  height: string;
}

export const Card = (props: CardProps) => {
  return (
    <Image
      src={
        props.isBack
          ? "/public/cards/Red_Back.svg"
          : "/public/cards/" + props.value + ".svg"
      }
      height={props.height}
      onClick={props.onClick}
    />
  );
};
