"use client";
import "@/styles/globals.css";
import AiModal from "@/components/AiModal";
import { SignerOptions, wallets } from "cosmos-kit";
import { ChainProvider } from "@cosmos-kit/react";
import { assets, chains } from "chain-registry";
import "@interchain-ui/react/styles";
import {
  Box,
  ThemeProvider,
  useColorModeValue,
  useTheme,
} from "@interchain-ui/react";
import { Toaster } from "react-hot-toast";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <AiModal />
        <ThemeProvider>
          <ChainProvider
            chains={chains}
            assetLists={assets}
            wallets={wallets}
            walletConnectOptions={{
              signClient: {
                projectId: "a8510432ebb71e6948cfd6cde54b70f7",
                relayUrl: "wss://relay.walletconnect.org",
                metadata: {
                  name: "Cosmos Kit dApp",
                  description: "Cosmos Kit dApp built by Create Cosmos App",
                  url: "https://docs.cosmology.zone/cosmos-kit/",
                  icons: [],
                },
              },
            }}
          >
            {children}
          </ChainProvider>
        </ThemeProvider>
        <Toaster position="top-right" />
      </body>
    </html>
  );
}
