import type { ArrayLiteralExpression } from "ts-morph";

export function addArrayElement(
  array: ArrayLiteralExpression,
  element: string
) {
  const exists = array.getElements().some(
    item => item.getText() === element
  );

  if (!exists) {
    array.addElement(element);
  }
}

export function removeArrayElement(
  array: ArrayLiteralExpression,
  element: string
) {
  const target = array.getElements().find(
    item => item.getText() === element
  );

  if (target) {
    array.removeElement(target);
  }
}