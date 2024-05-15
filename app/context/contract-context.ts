import { Contract } from "ethers";
import { createContext } from "react";

export const ContractContext = createContext({
  nftMarketContract: null as Contract | null,
  nftContract: null as Contract | null,
});
