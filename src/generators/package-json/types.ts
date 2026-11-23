export interface PackageJsonOptions {
  name: string;
  version?: string;
  description?: string;
  private?: boolean;
  type?: "module" | "commonjs";

  scripts?: Record<string, string>;

  dependencies?: Record<string, string>;
  devDependencies?: Record<string, string>;

  engines?: {
    node?: string;
    npm?: string;
  };
}

export interface GeneratedPackageJson {
  name: string;
  version: string;
  description?: string;
  private: boolean;
  type: "module" | "commonjs";

  scripts: Record<string, string>;

  dependencies: Record<string, string>;
  devDependencies: Record<string, string>;

  engines?: {
    node?: string;
    npm?: string;
  };
}
