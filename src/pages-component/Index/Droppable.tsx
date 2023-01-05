import { useDroppable } from "@dnd-kit/core";
import { Button, Card, Group, Stack, Text } from "@mantine/core";
import React, { FC } from "react";
import { v4 as uuidv4 } from "uuid";

import type { Container } from "../../type/BoardType";
import { SortableItem } from "./SortableItem";

type Props = {
  container: Container;
  setContainers: React.Dispatch<React.SetStateAction<Container[]>>;
};

export const Droppable: FC<Props> = (props) => {
  const { setNodeRef, active } = useDroppable({
    id: props.container.containerId,
  });

  const handleAddItem: React.MouseEventHandler<HTMLButtonElement> = () => {
    props.setContainers((prevContainers) => {
      const newContainers = prevContainers.map((prevContainer) => {
        if (prevContainer.containerId === props.container.containerId) {
          const newItems = [
            ...prevContainer.items,
            {
              itemId: uuidv4(),
              subTitle: `subTitleAdd`,
            },
          ];

          const newContainer = { ...prevContainer, items: newItems };
          return newContainer;
        }
        return prevContainer;
      });
      return newContainers;
    });
  };

  return (
    <Card
      className="overflow-visible min-h-[235px]"
      ref={setNodeRef}
      withBorder
      w={300}
    >
      <Card.Section withBorder p="xs">
        <Group position="apart" align="center">
          <Text weight={500}>{props.container.mainTitle}</Text>
          <Button size="xs" onClick={handleAddItem}>
            add item
          </Button>
        </Group>
      </Card.Section>
      <Card.Section className="" p="xs">
        <Stack spacing="sm">
          {props.container.items.map((item) => (
            <SortableItem
              key={item.itemId}
              item={item}
              active={active?.id === item.itemId}
            />
          ))}
        </Stack>
      </Card.Section>
    </Card>
  );
};
