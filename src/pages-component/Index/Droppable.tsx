import { useDroppable } from "@dnd-kit/core";
import { Button, Card, Stack, Text } from "@mantine/core";
import React from "react";

import type { Container } from "../../type/BoardType";
import { SortableItem } from "./SortableItem";

export const Droppable = (props: { container: Container }) => {
  const { setNodeRef } = useDroppable({
    id: props.container.containerId,
  });

  const handleAddItem: React.MouseEventHandler<HTMLButtonElement> = () => {};

  return (
    <Card
      className="overflow-visible min-h-[235px]"
      ref={setNodeRef}
      withBorder
      w={300}
    >
      <Card.Section withBorder p="xs">
        <Text weight={500}>{props.container.mainTitle}</Text>
      </Card.Section>
      <Card.Section className="" p="xs">
        <Stack spacing="sm">
          {props.container.items.map((item) => (
            <SortableItem key={item.itemId} item={item} />
          ))}
          <Button onClick={handleAddItem}>add item</Button>
        </Stack>
      </Card.Section>
    </Card>
  );
};
