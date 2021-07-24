import { ListUI } from "./ListModel";
import React from "react";
import { ListController } from ".";
import { List, ListItem } from "@chakra-ui/react";

export function ListView({ controller }: { controller: ListController }) {
  const component = controller.get() as ListUI;

  return (
    <List spacing={3} key={"list-" + component.id}>
      {component.items.map((uiComponent, index) => (
        <ListItem key={"list-item-" + index}>{uiComponent}</ListItem>
      ))}
    </List>
  );
}
