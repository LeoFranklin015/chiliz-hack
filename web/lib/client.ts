import { createPublicClient, createWalletClient, custom, http } from "viem";
import { spicy } from "viem/chains";

// Create public client that works on server and client
export const client = createPublicClient({
  chain: spicy,
  transport: http("https://spicy-rpc.chiliz.com"),
});

// Safely create wallet client only in browser environment
export const walletClient =
  typeof window !== "undefined"
    ? createWalletClient({
        chain: spicy,
        transport: custom(window.ethereum),
      })
    : null;
