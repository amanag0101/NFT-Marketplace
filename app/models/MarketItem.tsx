export interface MarketItem {
  nftContract: string;
  owner: string;
  seller: string;
  itemId: number;
  itemName: string;
  itemDescription: string;
  tokenId: number;
  uri?: string;
  price: number;
  isSold: boolean;
}
