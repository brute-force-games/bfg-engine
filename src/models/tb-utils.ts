import type { Cell } from "tinybase";

export type TinybaseCell = Cell;

export type RequireCells<T> = {
  [K in keyof T]: T[K] extends Cell ? T[K] : never;
};

export type InvalidCellFields<T> = {
  [Key in keyof T]-?: T[Key] extends Cell ? never : Key;
}[keyof T];

export type EnsureCells<T> = InvalidCellFields<T> extends never ? T : never;
