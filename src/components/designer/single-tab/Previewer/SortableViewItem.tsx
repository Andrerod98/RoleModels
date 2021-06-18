import { useSortable } from "@dnd-kit/sortable";
import React from "react";
import { ViewItem } from "./ViewItem";
import { Position } from "./ViewItemOverlay";
import { CSS } from "@dnd-kit/utilities";
import { View } from "../../../../shared-object/views/View";

interface SortableViewItemProps {
  id: string;
  view: View;
  onClickRight: () => void;
  onClickLeft: () => void;
  onClickTopLeft: () => void;
  onClickBottomRight: () => void;
  onClickTop: () => void;
  onClickBottom: () => void;
  onClose: () => void;

  activeIndex: number;
}
export const SortableViewItem = (props: SortableViewItemProps) => {
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
    id: props.id,
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
      attributes={attributes}
      listeners={listeners}
      insertPosition={
        over?.id === props.id
          ? index > props.activeIndex
            ? Position.After
            : Position.Before
          : undefined
      }
      {...props}
    />
  );
};
