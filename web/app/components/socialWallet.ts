import { Wallet, getWalletConnectConnector } from "@rainbow-me/rainbowkit";
export interface MyWalletOptions {
  projectId: string;
}
export const sociosWallet = ({ projectId }: MyWalletOptions): Wallet => ({
  id: "socios-wallet",
  name: "Socios.com Wallet",
  iconUrl: "https://app.socios.com/splash/icon.webp",
  iconBackground: "#1C39C2",
  downloadUrls: {
    android: "https://play.google.com/store/apps/details?id=com.socios.wallet",
    ios: "https://apps.apple.com/app/id1464868277",
    qrCode: "https://app.socios.com",
  },
  mobile: {
    getUri: (uri: string) => {
      return `socios-mob://wc?uri=${encodeURIComponent(uri)}`;
    },
  },
  qrCode: {
    getUri: (uri: string) => uri,
    instructions: {
      learnMoreUrl: "https://socios.com/learn-more",
      steps: [
        {
          description:
            "We recommend adding Socios Wallet to your home screen for faster access.",
          step: "install",
          title: "Open the Socios Wallet.com app",
        },
        {
          description: "Be sure to back up your wallet using a secure method",
          step: "create",
          title: "Create a Socios.com Wallet",
        },
        {
          description:
            "After scanning, a connection prompt will appear to connect your wallet.",
          step: "scan",
          title: "Tap the scan button",
        },
      ],
    },
  },
  createConnector: getWalletConnectConnector({ projectId }),
});
