export type BaseBB = {
  id: Number;
};

export type BBPaginationPage<T extends BaseBB> = {
  data: T[];
  lastPage: Number;
  total: Number;
  currentPage: Number;
}
