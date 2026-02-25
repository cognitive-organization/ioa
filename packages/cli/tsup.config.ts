import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts", "bin/ioa.ts"],
  format: ["esm"],
  dts: true,
  clean: true,
  splitting: false,
});
