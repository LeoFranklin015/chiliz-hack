"use client";

import "@rainbow-me/rainbowkit/styles.css";
import {
  connectorsForWallets,
  RainbowKitProvider,
} from "@rainbow-me/rainbowkit";
import { createConfig, WagmiProvider } from "wagmi";
import { spicy } from "wagmi/chains";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { sociosWallet } from "./socialWallet";
import { http } from "wagmi";

const connectors = connectorsForWallets(
  [
    {
      groupName: "Recommended",
      wallets: [sociosWallet],
    },
  ],
  {
    appName: "ScoreZ",
    projectId: process.env.NEXT_PUBLIC_PROJECT_ID || "",
  }
);

export const config = createConfig({
  connectors,
  chains: [spicy],
  transports: {
    [spicy.id]: http(),
  },
  ssr: true,
});

export default function Provider({ children }: { children: React.ReactNode }) {
  const queryClient = new QueryClient();
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider>{children}</RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
