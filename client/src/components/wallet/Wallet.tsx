import { useEffect } from "react";
import {
  Box,
  ClipboardCopyText,
  Stack,
  useColorModeValue,
} from "@interchain-ui/react";
import { WalletStatus } from "@cosmos-kit/core";
import { useChain } from "@cosmos-kit/react";
import { chains } from "chain-registry";
import { User } from "./User";
import { Warning } from "./Warning";
import { ChainSelect } from "./Chain";
import { CHAIN_NAME, CHAIN_NAME_STORAGE_KEY } from "@/config";
import {
  ButtonConnect,
  ButtonConnected,
  ButtonConnecting,
  ButtonDisconnected,
  ButtonError,
  ButtonNotExist,
  ButtonRejected,
} from "./Connect";

export type WalletProps = {
  chainName?: string;
  onChainChange?: (chainName?: string) => void;
};

export function Wallet({
  chainName = CHAIN_NAME,
  onChainChange = () => {},
}: WalletProps) {
  const {
    chain,
    status,
    wallet,
    username,
    address,
    message,
    connect,
    openView,
  } = useChain(chainName);

  const ConnectButton = {
    [WalletStatus.Connected]: <ButtonConnected onClick={openView} />,
    [WalletStatus.Connecting]: <ButtonConnecting />,
    [WalletStatus.Disconnected]: <ButtonDisconnected onClick={connect} />,
    [WalletStatus.Error]: <ButtonError onClick={openView} />,
    [WalletStatus.Rejected]: <ButtonRejected onClick={connect} />,
    [WalletStatus.NotExist]: <ButtonNotExist onClick={openView} />,
  }[status] || <ButtonConnect onClick={connect} />;

  function handleChainChange(chainName?: string) {
    if (chainName) {
      onChainChange(chainName);
      localStorage.setItem(CHAIN_NAME_STORAGE_KEY, chainName!);
    }
  }

  useEffect(() => {
    const selected = localStorage.getItem(CHAIN_NAME_STORAGE_KEY);
    if (selected && selected !== chainName) {
      onChainChange(selected);
    }
  }, []);

  return (
    <div className="flex justify-center items-center gap-5">
      <Box> 
        <ChainSelect
          chains={chains}
          chainName={chain.chain_name}
          onChange={handleChainChange}
        />
      </Box>
      <Stack
        direction="vertical"
        attributes={{
          mx: "auto",
          maxWidth: "21rem",
          borderRadius: "$lg",
          justifyContent: "center",
         
        }}
      >
        <Box
          flex="1"
          width="full"
          display="flex"
          overflow="hidden"
          justifyContent="center"
        >
          {ConnectButton}
        </Box>

        {message &&
            [WalletStatus.Error, WalletStatus.Rejected].includes(status)
          ? <Warning text={`${wallet?.prettyName}: ${message}`} />
          : null}
      </Stack>
    </div>
  );
}
