import {
  Node,
  type ObjectLiteralExpression,
} from "ts-morph";

export function addObjectProperty(
  object: ObjectLiteralExpression,
  key: string,
  value: string
) {
  const existing = object.getProperty(key);

  if (existing) {
    throw new Error(
      `Property '${key}' already exists`
    );
  }

  object.addPropertyAssignment({
    name: key,
    initializer: value,
  });
}

export function updateObjectProperty(
  object: ObjectLiteralExpression,
  key: string,
  value: string
) {
  const existing = object.getProperty(key);

  if (!existing) {
    throw new Error(
      `Property '${key}' does not exist`
    );
  }

  if (Node.isPropertyAssignment(existing)) {
    existing.setInitializer(value);
  }
}

export function upsertObjectProperty(
  object: ObjectLiteralExpression,
  key: string,
  value: string
) {
  const existing =
    object.getProperty(key) ??
    object.getProperty(`"${key}"`) ??
    object.getProperty(`'${key}'`);

  if (!existing) {
    object.addPropertyAssignment({ name: key, initializer: value });
    return;
  }

  if (Node.isPropertyAssignment(existing)) {
    existing.setInitializer(value);
  }
}
