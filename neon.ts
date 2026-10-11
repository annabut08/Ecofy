import { defineConfig } from "@neon/config/v1";

export default defineConfig({
  preview: {
    buckets: {
      images111: { access: "private" },
    },
  },
});
