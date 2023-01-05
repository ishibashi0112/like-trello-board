import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Group, Text, ThemeIcon } from "@mantine/core";
import { IconGripVertical } from "@tabler/icons";
import React, { FC } from "react";

import { Item } from "../../type/BoardType";

type Props = {
  item: Item;
  active?: boolean;
};

export const SortableItem: FC<Props> = (props) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: props.item.itemId });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <Group
      className={`${props.active ? "opacity-30" : ""} bg-gray-500  p-1 rounded`}
      ref={setNodeRef}
      style={style}
      align="center"
    >
      <ThemeIcon
        {...attributes}
        {...listeners}
        className="cursor-grab hover:opacity-70 "
        variant="default"
        color="gray"
      >
        <IconGripVertical size={14} />
      </ThemeIcon>
      <Text>{props.item.subTitle}</Text>
    </Group>
  );
};
