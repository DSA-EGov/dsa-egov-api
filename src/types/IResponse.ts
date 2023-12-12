export interface IResponse<T> {
  readonly count: number;
  readonly data: T[];
}
