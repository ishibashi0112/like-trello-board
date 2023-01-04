export type Item = {
  itemId: string;
  subTitle: string;
};

export type Container = {
  mainTitle: string;
  containerId: string;
  items: Item[];
};
