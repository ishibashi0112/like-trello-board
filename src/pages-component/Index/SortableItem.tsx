import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Group } from "@mantine/core";
import React from "react";

import { Item } from "../../type/BoardType";

export const SortableItem = (props: { item: Item }) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: props.item.itemId });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <Group
      className="bg-gray-500 p-1 rounded"
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
    >
      {props.item.subTitle}
    </Group>
  );
};
