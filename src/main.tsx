import { StrictMode } from "react";
// import React from "react";
import ReactDOM from "react-dom/client";
import { ChakraProvider } from "@chakra-ui/react";
import { WagmiProvider } from "wagmi";
import { config } from "../wagmi.config";
import "./index.css";
import App from "./App";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <ChakraProvider>
        <WagmiProvider config={config}>
          <App />
        </WagmiProvider>
      </ChakraProvider>
    </QueryClientProvider>
  </StrictMode>
);
