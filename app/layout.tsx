"use client";

import Header from "./components/common/header";
import Footer from "./components/common/footer";
import { useEffect, useMemo, useState } from "react";
import { ethers, Contract, JsonRpcSigner } from "ethers";
import { env } from "../env";
import NFT from "../artifacts/contracts/NFT.sol/NFT.json";
import NFTMarket from "../artifacts/contracts/NFTMarket.sol/NFTMarket.json";
import { SignerContext } from "./context/signer-context";
import Toast, { ToastProps } from "./components/ui/toast";
import { ToastContext } from "./context/toast-context";
import { ContractContext } from "./context/contract-context";
import Skeleton from "./components/ui/skeleton";
import Button from "./components/ui/button";
import "./globals.css";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [loading, setLoading] = useState(false);
  const [nftMarketContract, setNftMarketContract] = useState<Contract | null>(
    null
  );
  const [nftContract, setNftContract] = useState<Contract | null>(null);
  const [signer, setSigner] = useState<JsonRpcSigner | null>(null);
  const [toast, setToast] = useState<ToastProps | null>(null);
  const [toastKey, setToastKey] = useState<number>(1);
  const toastMemoized = useMemo(
    () => ({ toast, setToast, toastKey, setToastKey }),
    [toast, setToast, toastKey, setToastKey]
  );

  const connect = async (account = null) => {
    setLoading(true);

    if (!window.ethereum) {
      setToast({
        message: "Please install MetaMask extension to use this application.",
        timeout: 5000,
        type: "error",
      });
      setToastKey((prev) => prev + 1);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);

      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = account
        ? await provider.getSigner(account)
        : await provider.getSigner();

      const nftContract = new Contract(env.nftContractAddress, NFT.abi, signer);

      const nftMarketContract = new Contract(
        env.nftMarketContractAddress,
        NFTMarket.abi,
        signer
      );

      setNftMarketContract(nftMarketContract);
      setNftContract(nftContract);
      setSigner(signer);
      setLoading(false);
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (window.ethereum) {
      const handleAccountChange = async () => {
        const accounts = await window.ethereum.request({
          method: "eth_accounts",
        });

        if (accounts.length > 0) {
          connect(accounts[0]);
        } else {
          setNftMarketContract(null);
          setNftContract(null);
          setSigner(null);
        }
      };

      window.ethereum.on("accountsChanged", handleAccountChange);

      return () => {
        window.ethereum?.removeListener("accountsChanged", handleAccountChange);
      };
    } else {
      setNftMarketContract(null);
      setNftContract(null);
      setSigner(null);
    }
  }, []);

  return (
    <html lang="en">
      <body className="dark">
        <ContractContext.Provider value={{ nftMarketContract, nftContract }}>
          <SignerContext.Provider value={{ signer }}>
            <ToastContext.Provider value={toastMemoized}>
              <div className="bg-primary-200-light dark:bg-primary-200-dark text-txt-primary-light dark:text-txt-primary-dark h-screen flex flex-col">
                {loading ? (
                  <Skeleton className="p-4" />
                ) : (
                  <>
                    <div className="flex justify-between">
                      <Header />
                      {!signer && (
                        <Button
                          className="w-fit"
                          size={"small"}
                          text={"Connect Wallet"}
                          onClick={() => connect()}
                        />
                      )}
                    </div>
                    <div className="flex-1 overflow-auto">{children}</div>
                    <Footer />
                    {toast && <Toast key={toastKey} {...toast} />}
                  </>
                )}
              </div>
            </ToastContext.Provider>
          </SignerContext.Provider>
        </ContractContext.Provider>
      </body>
    </html>
  );
}
