import { Grid } from "@chakra-ui/react";
import {
  closestCenter,
  DndContext,
  DragOverlay,
  KeyboardSensor,
  LayoutMeasuringStrategy,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  sortableKeyboardCoordinates,
} from "@dnd-kit/sortable";
import React, { useState } from "react";
import { View } from "../../../../shared-object/views/View";
import { SortableViewItem } from "./SortableViewItem";
import { ViewItemOverlay } from "./ViewItemOverlay";

interface ItemView {
  id: string;
  view: View;
}
interface PreviewProps {
  width: string;
  height: string;
  items: ItemView[];
  onItemChange: (item: ItemView, rows: number, cols: number) => void;
  onItemDelete: (item: ItemView) => void;
  onItemMove: (fromId: number, toId: number) => void;
}
export const Preview = (props: PreviewProps) => {
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  function handleDragEnd(event: any) {
    const { active, over } = event;
    if (active.id !== over.id) {
      props.onItemMove(active.id, over.id);
    }
    setActiveIndex(-1);
  }

  function handleDragStart(event: any) {
    const index = props.items.findIndex((item) => item.id === event.active.id);
    setActiveIndex(index);
  }

  const [activeIndex, setActiveIndex] = useState(-1);

  return (
    <Grid
      h={props.height}
      w={props.width}
      overflow={"hidden"}
      templateRows={"repeat(12, 1fr)"}
      templateColumns={"repeat(12, 1fr)"}
      gap={2}
    >
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
        onDragStart={handleDragStart}
        layoutMeasuring={LayoutMeasuringStrategy.Always as any}
      >
        <SortableContext items={props.items}>
          {props.items.map((item: ItemView) => (
            <SortableViewItem
              key={"sortable-item" + item.id}
              item={item}
              onClickRight={() => {
                props.onItemChange(item, 1, 0);
              }}
              onClickDown={() => {
                props.onItemChange(item, 0, 1);
              }}
              onClickTop={() => {
                props.onItemChange(item, 0, -1);
              }}
              onClickLeft={() => {
                props.onItemChange(item, -1, 0);
              }}
              onClickTopLeft={() => {
                props.onItemChange(item, -1, -1);
              }}
              onClickBottomRight={() => {
                props.onItemChange(item, 1, 1);
              }}
              onClose={() => {
                props.onItemDelete(item);
              }}
              activeIndex={activeIndex}
            />
          ))}
        </SortableContext>
        <DragOverlay>
          {activeIndex != -1 ? (
            <Grid
              h={props.height}
              w={props.width}
              overflow={"hidden"}
              templateRows={"repeat(12, 1fr)"}
              templateColumns={"repeat(12, 1fr)"}
              gap={2}
            >
              <ViewItemOverlay
                id={activeIndex}
                items={props.items}
                activeIndex={activeIndex}
              />
            </Grid>
          ) : null}
        </DragOverlay>
      </DndContext>
    </Grid>
  );
};
