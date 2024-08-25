import { createConfig } from "wagmi";
import { createPublicClient, http } from "viem";
import { mainnet } from "viem/chains";

// Configure Wagmi
export const config = createConfig({
  chains: [mainnet],
  transports: {
    [mainnet.id]: http(import.meta.env.VITE_ALCHEMY_PROVIDER_URL),
  },
});

// Configure Viem
export const publicClient = createPublicClient({
  chain: mainnet,
  transport: http(import.meta.env.VITE_ALCHEMY_PROVIDER_URL),
});
