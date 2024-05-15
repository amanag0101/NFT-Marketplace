"use client";

import React, { useContext, useEffect, useState } from "react";
import ProductDetailsCard from "../common/product-details-card";
import { ContractContext } from "@/app/context/contract-context";
import { ToastContext } from "@/app/context/toast-context";
import Skeleton from "../ui/skeleton";
import { MarketItem } from "@/app/models/MarketItem";
import { convertToEther, convertToInteger } from "@/app/utils/utils";
import { env } from "@/env";
import Typography from "../ui/typography";
import { useRouter } from "next/navigation";
import { ethers } from "ethers";

const AllNFT = () => {
  const router = useRouter();

  const { nftContract, nftMarketContract } = useContext(ContractContext);
  const { setToast, setToastKey } = useContext(ToastContext);

  const [loading, setLoading] = useState(false);
  const [marketItems, setMarketItems] = useState<MarketItem[]>([]);

  const getMarketItems = async () => {
    setLoading(true);

    try {
      const response = await nftMarketContract?.getMarketItems();
      const marketItems: MarketItem[] = [];

      await Promise.all(
        response.map(async (item: MarketItem) => {
          const uri = await nftContract?.getTokenURI(item.tokenId);
          marketItems.push({
            nftContract: item.nftContract,
            owner: item.owner,
            seller: item.seller,
            itemId: convertToInteger(item.itemId.toString()),
            itemName: item.itemName,
            itemDescription: item.itemDescription,
            tokenId: convertToInteger(item.tokenId.toString()),
            uri: uri,
            price: convertToEther(item.price.toString()),
            isSold: item.isSold,
          });
        })
      );

      setMarketItems(marketItems);
      setLoading(false);
    } catch (error: any) {
      setToast({
        message:
          error?.reason ||
          error?.message ||
          "Some error occurred while fetching market items.",
        type: "error",
      });
      setToastKey((prev) => prev + 1);
      setLoading(false);
    }
  };

  const onBuy = async (item: MarketItem) => {
    setLoading(true);

    try {
      const nftContractAddress = await nftContract?.getAddress();

      const transaction = await nftMarketContract?.createMarketSale(
        nftContractAddress,
        item.itemId,
        {
          value: ethers.parseEther(item.price.toString()),
        }
      );

      await transaction.wait();

      setToast({
        message: "NFT purchased successfully!",
        type: "success",
      });
      setToastKey((prev) => prev + 1);
      router.replace("/dashboard");
    } catch (error: any) {
      setToast({
        message:
          error?.reason ||
          error?.message ||
          "Some error occurred while buying the item.",
        type: "error",
      });
      setToastKey((prev) => prev + 1);
      setLoading(false);
    }
  };

  useEffect(() => {
    nftContract && nftMarketContract && getMarketItems();
  }, [nftMarketContract]);

  return (
    <div className="flex flex-col p-4">
      {loading ? (
        <Skeleton />
      ) : marketItems.length === 0 ? (
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center w-full">
          <Typography variant="p" text="No items in the marketplace." />
          <Typography
            variant="p"
            text="Market listings created by you will be visible in your Dashboard."
          />
        </div>
      ) : (
        <div className="flex justify-evenly flex-wrap gap-4">
          {marketItems.map((item) => (
            <ProductDetailsCard
              key={item.tokenId}
              className="w-full md:w-1/4 flex-grow"
              imgSrc={`${item.uri}?pinataGatewayToken=${env.pinataGatewayKey}`}
              imgAlt="Product image"
              name={item.itemName}
              description={item.itemDescription}
              price={item.price}
              onClickBuy={() => onBuy(item)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default AllNFT;
