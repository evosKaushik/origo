import type { TechStackOption } from "../types/project.js";

export const databaseOptions: TechStackOption[] = [
  { name: "MongoDB", value: "mongodb" },
  { name: "PostgreSQL", value: "postgresql" },
  { name: "None", value: "none" },
];

export const databasePackageOptions: Record<string, TechStackOption[]> = {
  mongodb: [
    {
      name: "MongoDB Driver",
      value: "mongodb-driver",
      description: "Official Node.js MongoDB driver",
    },
    {
      name: "Mongoose",
      value: "mongoose",
      description: "MongoDB object modeling",
    },
  ],
  postgresql: [
    {
      name: "node-postgres (pg)",
      value: "postgresql-driver",
      description: "PostgreSQL client and connection pooling",
    },
    {
      name: "Prisma",
      value: "prisma",
      description: "Type-safe ORM with schema migrations",
    },
    {
      name: "Sequelize",
      value: "sequelize",
      description: "Promise-based ORM",
    },
  ],
};
