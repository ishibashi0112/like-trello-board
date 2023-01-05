import {
  DndContext,
  DragOverlay,
  KeyboardSensor,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  DragOverEvent,
  DragStartEvent,
  UniqueIdentifier,
} from "@dnd-kit/core/dist/types";
import { SortableContext } from "@dnd-kit/sortable";
import { Button, Group, SimpleGrid } from "@mantine/core";
import React, { FC, useCallback, useState } from "react";
import { v4 as uuidv4 } from "uuid";

import type { Container, Item } from "../../type/BoardType";
import { Droppable } from "./Droppable";
import { SortableItem } from "./SortableItem";

const initialContainer: Container[] = [1, 2, 3, 4].map((_) => {
  return {
    mainTitle: "testTitle",
    containerId: uuidv4(),
    items: [1, 2, 3].map((_, index) => {
      return { itemId: uuidv4(), subTitle: `subTitle${index + 1}` };
    }),
  };
});

const getItemIds = (container: Container): string[] => {
  const itemIds = container.items.map((item) => item.itemId);
  return itemIds;
};

const findContainer = (
  containers: Container[],
  id: UniqueIdentifier
): Container | undefined => {
  const targetContainer = containers.find((container) => {
    const hasTargetItem = container.items.some((item) => item.itemId === id);
    if (hasTargetItem) return container;
  });

  return targetContainer;
};

const updateContainersArray = (
  prevContainers: Container[],
  activeId: UniqueIdentifier,
  overContainerId: UniqueIdentifier,
  activeContainerId: UniqueIdentifier,
  activeContainer: Container
) => {
  const newContainer = prevContainers.map((container) => {
    const prevContainerId = container.containerId;

    if (prevContainerId === activeContainerId) {
      const removedActiveItem = activeContainer.items.filter(
        (item) => item.itemId !== activeId
      );

      return { ...container, items: removedActiveItem };
    }

    if (prevContainerId === overContainerId) {
      const activeItem = activeContainer.items.filter(
        (item) => item.itemId === activeId
      );
      const newItems = [...container.items, ...activeItem];

      return { ...container, items: newItems };
    }
    return container;
  });

  return newContainer;
};

const getNewContainers = (
  prevContainers: Container[],
  activeId: UniqueIdentifier,
  overId: UniqueIdentifier
): Container[] => {
  const overContainer = findContainer(prevContainers, overId);
  const overContainerId = overContainer?.containerId;
  const activeContainer = findContainer(prevContainers, activeId);
  const activeContainerId = activeContainer?.containerId;

  if (!activeContainerId || overId === activeContainerId) return prevContainers;

  if (!overContainerId) {
    return updateContainersArray(
      prevContainers,
      activeId,
      overId,
      activeContainerId,
      activeContainer
    );
  } else {
    if (activeContainerId === overContainerId) return prevContainers;

    return updateContainersArray(
      prevContainers,
      activeId,
      overContainerId,
      activeContainerId,
      activeContainer
    );
  }
};

const getItemByActiveId = (
  containers: Container[],
  activeId: UniqueIdentifier
): Item | null => {
  const targetContainer = containers.find((container) => {
    return container.items.some((item) => item.itemId === activeId);
  });
  if (!targetContainer) return null;

  const targetItem = targetContainer.items.find(
    (item) => item.itemId === activeId
  );
  return targetItem ? targetItem : null;
};

export const Board: FC = () => {
  const [containers, setContainers] = useState<Container[]>(initialContainer);
  const [activeItem, setActiveItem] = useState<Item | null>(null);

  const sensors = useSensors(
    useSensor(MouseSensor),
    useSensor(TouchSensor),
    useSensor(KeyboardSensor)
  );

  const handleDragStart = useCallback(
    (event: DragStartEvent): void => {
      const item = getItemByActiveId(containers, event.active.id);
      setActiveItem(item);
    },
    [containers]
  );

  const handleDragOver = useCallback(
    (event: DragOverEvent): void => {
      const { active, over } = event;

      if (!over) return;

      setContainers((prev) => getNewContainers(prev, active.id, over.id));
    },
    [containers]
  );

  const handleAddContainer: React.MouseEventHandler<HTMLButtonElement> = () => {
    setContainers((prev) => [
      ...prev,
      { mainTitle: "testTitle", containerId: uuidv4(), items: [] },
    ]);
  };

  return (
    <div>
      <Group className="mb-10" position="right">
        <Button onClick={handleAddContainer}>add container</Button>
      </Group>
      <DndContext
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        sensors={sensors}
      >
        <SimpleGrid
          cols={3}
          breakpoints={[
            { maxWidth: 1050, cols: 3, spacing: "md" },
            { maxWidth: 960, cols: 2, spacing: "sm" },
            { maxWidth: 700, cols: 1, spacing: "sm" },
          ]}
        >
          {containers.map((container) => (
            <SortableContext
              key={container.containerId}
              items={getItemIds(container)}
            >
              <Droppable container={container} setContainers={setContainers} />
            </SortableContext>
          ))}
        </SimpleGrid>

        <DragOverlay>
          {activeItem ? <SortableItem item={activeItem} /> : null}
        </DragOverlay>
      </DndContext>
    </div>
  );
};
