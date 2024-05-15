"use client";

import React, { useContext, useEffect, useRef, useState } from "react";
import ProductDetailsCard from "../common/product-details-card";
import Typography from "../ui/typography";
import { ContractContext } from "@/app/context/contract-context";
import { ToastContext } from "@/app/context/toast-context";
import { MarketItem } from "@/app/models/MarketItem";
import Skeleton from "../ui/skeleton";
import { convertToEther, convertToInteger } from "@/app/utils/utils";
import { env } from "@/env";

const Dashboard = () => {
  const containerRef = useRef(null);

  const { nftContract, nftMarketContract } = useContext(ContractContext);
  const { setToast, setToastKey } = useContext(ToastContext);

  const [loading, setLoading] = useState(false);
  const [myMarketItemsForSale, setMyMarketItemsForSale] = useState<
    MarketItem[]
  >([]);
  const [marketItemsPurchased, setMarketItemsPurchased] = useState<
    MarketItem[]
  >([]);

  const getMarketItemsOnSaleByUser = async () => {
    setLoading(true);

    try {
      const response = await nftMarketContract?.getMarketItemsOnSaleByAUser();
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

      setMyMarketItemsForSale(marketItems);
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

  const getMarketItemPurchasedByUser = async () => {
    setLoading(true);

    try {
      const response =
        await nftMarketContract?.getMarketItemsPurchasedByAUser();
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

      setMarketItemsPurchased(marketItems);
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

  useEffect(() => {
    nftContract && nftMarketContract && getMarketItemsOnSaleByUser();
    nftContract && nftMarketContract && getMarketItemPurchasedByUser();
  }, [nftMarketContract]);

  return (
    <div className="flex flex-col gap-4 p-4" ref={containerRef}>
      {loading ? (
        <Skeleton />
      ) : (
        <>
          <div className="flex flex-col gap-4">
            <Typography variant="h4" text="My market listings" />
            {myMarketItemsForSale.length === 0 ? (
              <Typography
                className="text-center"
                variant="p"
                text="No market listings created yet."
              />
            ) : (
              <div className="flex flex-wrap justify-evenly gap-2">
                {myMarketItemsForSale.map((item) => (
                  <ProductDetailsCard
                    key={item.tokenId}
                    className="md:w-1/4 flex-grow"
                    imgSrc={`${item.uri}?pinataGatewayToken=${env.pinataGatewayKey}`}
                    imgAlt="Product image"
                    name={item.itemName}
                    description={item.itemDescription}
                    price={item.price}
                    showBuyButton={false}
                  />
                ))}
              </div>
            )}
          </div>

          <div className="flex flex-col gap-4">
            <Typography variant="h4" text="Purchased NFTs" />
            {marketItemsPurchased.length === 0 ? (
              <Typography
                className="text-center"
                variant="p"
                text="No NFTs purchased yet."
              />
            ) : (
              <div className="flex flex-wrap justify-evenly gap-2">
                {marketItemsPurchased.map((item) => (
                  <ProductDetailsCard
                    key={item.tokenId}
                    className="md:w-1/4 flex-grow"
                    imgSrc={`${item.uri}?pinataGatewayToken=${env.pinataGatewayKey}`}
                    imgAlt="Product image"
                    name={item.itemName}
                    description={item.itemDescription}
                    price={item.price}
                    showBuyButton={false}
                    showPrice={false}
                  />
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default Dashboard;
