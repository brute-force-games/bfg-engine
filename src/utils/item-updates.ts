
interface ItemWithUpdatedAt {
  updatedAt: number;
}

export const hasItemUpdated = (item: ItemWithUpdatedAt, maybeUpdatedItem: ItemWithUpdatedAt): boolean => {
  return item.updatedAt !== maybeUpdatedItem.updatedAt;
};