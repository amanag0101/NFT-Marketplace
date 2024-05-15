import React, { useContext, useEffect, useState } from "react";
import Form from "../ui/form";
import Input from "../ui/input";
import { ToastContext } from "@/app/context/toast-context";
import Button from "../ui/button";
import Typography from "../ui/typography";
import { ContractContext } from "@/app/context/contract-context";
import { convertToEther, convertToInteger } from "@/app/utils/utils";
import { env } from "@/env";
import { ethers } from "ethers";

interface FormProps {
  setShowSellNFTDialog: (show: boolean) => void;
}

const SellNFTForm = ({ setShowSellNFTDialog }: FormProps) => {
  const { nftContract, nftMarketContract } = useContext(ContractContext);
  const { setToast, setToastKey } = useContext(ToastContext);

  const [loading, setLoading] = useState(false);
  const [price, setPrice] = useState<number>(0);
  const [file, setFile] = useState<File | null>(null);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [listingPrice, setListingPrice] = useState<number | null>(null);

  const getListingPrice = async () => {
    setLoading(true);
    try {
      const listingPrice = await nftMarketContract?.getListingPrice();
      setListingPrice(listingPrice);
      setLoading(false);
    } catch (error: any) {
      setToast({
        message:
          error?.reason ||
          error?.message ||
          "Some error occurred while fetching the listing price.",
        type: "error",
      });
      setToastKey((prev) => prev + 1);
      setLoading(false);
    }
  };

  const sellNFT = async () => {
    setLoading(true);

    if (!file) {
      setToast({
        message: "Please select a file to upload.",
        type: "error",
      });
      setToastKey((prev) => prev + 1);
      setLoading(false);
      return;
    }

    if (!price || price <= 0) {
      setToast({
        message: "Price must be greater than 0.",
        type: "error",
      });
      setToastKey((prev) => prev + 1);
      setLoading(false);
      return;
    }

    if (!name) {
      setToast({
        message: "Please enter NFT name.",
        type: "error",
      });
      setToastKey((prev) => prev + 1);
      setLoading(false);
      return;
    }

    if (!description) {
      setToast({
        message: "Please enter NFT description.",
        type: "error",
      });
      setToastKey((prev) => prev + 1);
      setLoading(false);
      return;
    }

    try {
      // Upload file to IPFS
      const formData = new FormData();

      formData.append("file", file);

      const metadata = JSON.stringify({
        name: file.name,
      });
      formData.append("pinataMetadata", metadata);

      const options = JSON.stringify({
        cidVersion: 0,
      });
      formData.append("pinataOptions", options);

      const response = await fetch(
        "https://api.pinata.cloud/pinning/pinFileToIPFS",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${env.pinataAPIKey}`,
          },
          body: formData,
        }
      );
      const responseData = await response.json();
      const uri = env.pinataGateway + "/" + responseData.IpfsHash;

      // Mint NFT
      const mintNftTransaction = await nftContract?.createToken(uri);
      const receiptMintNft = await mintNftTransaction.wait();
      const mintNftEvents = receiptMintNft.logs?.[0];
      const tokenId = convertToInteger(mintNftEvents?.args?.[2]);

      // Create market listing
      const nftContractAddress = await nftContract?.getAddress();
      const createMarketListingTransaction =
        await nftMarketContract?.createMarketItem(
          nftContractAddress,
          tokenId,
          ethers.parseEther(price.toString()),
          name,
          description,
          { value: listingPrice?.toString() }
        );
      await createMarketListingTransaction.wait();

      setToast({
        message: "Market listing created successfully!",
        type: "success",
      });
      setToastKey((prev) => prev + 1);
      setShowSellNFTDialog(false);
    } catch (error: any) {
      setToast({
        message:
          error?.reason ||
          error?.message ||
          "Some error occurred while listing item.",
        type: "error",
      });
      setToastKey((prev) => prev + 1);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (nftMarketContract) getListingPrice();
  }, [nftMarketContract]);

  return (
    <Form loading={loading}>
      <Input
        name="price"
        value={price.toString()}
        type="number"
        size="small"
        sizeMedium="medium"
        placeholder="Price (ether)"
        onChange={(e) => setPrice(parseInt(e.target.value))}
      />

      <Input
        name="name"
        value={name}
        type="text"
        size="small"
        sizeMedium="medium"
        placeholder="NFT name"
        onChange={(e) => setName(e.target.value)}
      />

      <Input
        name="description"
        value={description}
        type="text"
        size="small"
        sizeMedium="medium"
        placeholder="NFT description"
        onChange={(e) => setDescription(e.target.value)}
      />

      <input
        name="file"
        type="file"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) setFile(file);
        }}
      />

      {listingPrice && (
        <Typography
          className="text-red"
          variant="p"
          text={`Please note that a listing price of ${convertToEther(
            listingPrice.toString()
          )} ether will be deducted from your account.`}
        />
      )}

      <Button
        className="w-fit ml-auto"
        size="small"
        sizeMedium="medium"
        text="Create listing"
        onClick={sellNFT}
      />
    </Form>
  );
};

export default SellNFTForm;
