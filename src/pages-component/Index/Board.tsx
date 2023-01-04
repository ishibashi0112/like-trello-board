import { DndContext, DragEndEvent, DragOverlay } from "@dnd-kit/core";
import {
  DragOverEvent,
  DragStartEvent,
  UniqueIdentifier,
} from "@dnd-kit/core/dist/types";
import { SortableContext } from "@dnd-kit/sortable";
import { Button, Group } from "@mantine/core";
import React, { FC, useCallback, useState } from "react";

import type { Container, Item } from "../../type/BoardType";
import { Droppable } from "./Droppable";
import { SortableItem } from "./SortableItem";

const initialContainer: Container[] = [
  {
    mainTitle: "testTitle",
    containerId: "A",
    items: [
      { itemId: "1", subTitle: "subTitleA1" },
      { itemId: "2", subTitle: "subTitleA2" },
      { itemId: "3", subTitle: "subTitleA3" },
    ],
  },
  {
    mainTitle: "testTitle",
    containerId: "B",
    items: [
      { itemId: "4", subTitle: "subTitleB1" },
      { itemId: "5", subTitle: "subTitleB2" },
      { itemId: "6", subTitle: "subTitleB3" },
    ],
  },
  {
    mainTitle: "testTitle",
    containerId: "C",
    items: [
      { itemId: "7", subTitle: "subTitleC1" },
      { itemId: "8", subTitle: "subTitleC2" },
      { itemId: "9", subTitle: "subTitleC3" },
    ],
  },
];

const add = {
  mainTitle: "testTitle",
  containerId: "D",
  items: [
    { itemId: "10", subTitle: "subTitleD1" },
    { itemId: "11", subTitle: "subTitleD2" },
    { itemId: "12", subTitle: "subTitleD3" },
  ],
};

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

  const handleDragStart = useCallback((event: DragStartEvent): void => {
    const item = getItemByActiveId(containers, event.active.id);
    setActiveItem(item);
  }, []);

  const handleDragEnd = useCallback((event: DragEndEvent): void => {
    const { active, over } = event;

    if (!over) {
      return;
    }
    console.log(active.id, over.id);

    if (active.id !== over.id) {
      console.log(over.id);
      // setContainers((prevContainers) => {
      //   prevContainers.map((prevContainer) => {

      //   });
      // });

      // setContainers((prevContainers) => {
      //   const a = prevContainers.map((container) => {
      //     const oldIndex = container.items.indexOf(Number(active.id));
      //     const newIndex = container.items.indexOf(Number(over.id));
      //   });

      //   // return [];

      // });
    }
  }, []);

  const handleDragOver = useCallback(
    (event: DragOverEvent): void => {
      const { active, over } = event;

      if (!over) return;

      setContainers((prev) => getNewContainers(prev, active.id, over.id));
    },
    [containers]
  );

  const handleClick: React.MouseEventHandler<HTMLButtonElement> = () => {
    setContainers((prev) => [...prev, add]);
  };

  return (
    <div>
      <Group position="right">
        <Button onClick={handleClick}>add container</Button>
      </Group>
      <DndContext
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        onDragOver={handleDragOver}
      >
        <Group align="start">
          {containers.map((container) => (
            <SortableContext
              key={container.containerId as string}
              items={getItemIds(container)}
            >
              <Droppable container={container} />
            </SortableContext>
          ))}
        </Group>

        <DragOverlay>
          {activeItem ? <SortableItem item={activeItem} /> : null}
        </DragOverlay>
      </DndContext>
    </div>
  );
};
