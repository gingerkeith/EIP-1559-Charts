import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
//@ts-expect-error
export default defineConfig(({ mode }) => {
  const env = process.env;
  console.log("Vite config loaded w/ env:", env.VITE_ALCHEMY_PROVIDER_URL);

  return {
    plugins: [react()],
    define: {
      "process.env": env,
    },
  };
});

// export default defineConfig({
//   plugins: [react()],
// });
