import { JsonRpcSigner } from "ethers";
import { createContext } from "react";

export const SignerContext = createContext({
  signer: null as JsonRpcSigner | null,
});
