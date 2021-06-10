import { useSortable } from "@dnd-kit/sortable";
import React from "react";
import { ViewItem } from "./ViewItem";
import { Position } from "./ViewItemOverlay";
import { CSS } from "@dnd-kit/utilities";

export const SortableViewItem = (props: any) => {
  const {
    attributes,
    listeners,
    index,
    isSorting,
    over,
    setNodeRef,
    transform,
    transition,
  } = useSortable({
    id: props.item.id,
    animateLayoutChanges: () => {
      return true;
    },
  });
  const style = {
    transform: isSorting ? undefined : CSS.Translate.toString(transform),
    transition,
  };

  return (
    <ViewItem
      ref={setNodeRef}
      style={style}
      isOver={over?.id === props.item.id}
      attributes={attributes}
      listeners={listeners}
      {...props}
      insertPosition={
        over?.id === props.item.id
          ? index > props.activeIndex
            ? Position.After
            : Position.Before
          : undefined
      }
    />
  );
};
