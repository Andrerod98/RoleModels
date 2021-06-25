import { DndContext, useDraggable } from "@dnd-kit/core";
import Goo from "gooey-react";
import React from "react";
import { CSS } from "@dnd-kit/utilities";

function Draggable() {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: "unique-id",
  });
  const style = {
    transform: CSS.Translate.toString(transform),
  };

  return (
    <div
      ref={setNodeRef}
      style={{
        background: "palevioletred",
        borderRadius: "50%",
        height: "2rem",
        width: "2rem",
        zIndex: 1000,
        cursor: "pointer",
        ...style,
      }}
      {...listeners}
      {...attributes}
    ></div>
  );
}

export function GoeyStitch() {
  function handleDragStart(event) {}

  return (
    <DndContext onDragStart={handleDragStart}>
      <div
        style={{
          height: "100vh",
          overflow: "hidden",
          width: "100vw",
        }}
      >
        <Goo
          composite
          intensity='weak'
          style={{ height: "100vh", position: "relative", width: "80px" }}
        >
          <div
            style={{
              background: "sandybrown",
              height: "100%",
              width: "4rem",
              left: "0",
              top: "0",
              position: "absolute",
              zIndex: 0,
            }}
          >
            <Draggable />
          </div>
        </Goo>
      </div>
    </DndContext>
  );
}
