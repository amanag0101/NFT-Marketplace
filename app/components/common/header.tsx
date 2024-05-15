import { useContext, useState } from "react";
import Button from "../ui/button";
import Link from "next/link";
import { SignerContext } from "@/app/context/signer-context";
import Typography from "../ui/typography";
import Dialog from "../ui/dialog";
import SellNFTForm from "../public/sell-nft-form";

const Header = () => {
  const { signer } = useContext(SignerContext);
  const [showSellNFTDialog, setShowSellNFTDialog] = useState(false);

  return (
    <div className="bg-primary-100-light dark:bg-primary-100-dark flex flex-1 items-center justify-between p-4">
      <div className="flex justify-center gap-4">
        <Link href="/">
          <Button size="small" text="Buy NFT" />
        </Link>

        {signer && (
          <>
            <Link href="/dashboard">
              <Button size="small" text="Dashboard" />
            </Link>

            <Button
              size="small"
              text="Sell NFT"
              onClick={() => setShowSellNFTDialog(true)}
            />
          </>
        )}
      </div>
      {signer && <Typography variant="p" text={signer.address} />}
      {showSellNFTDialog && (
        <Dialog
          className="h-fit"
          size="small"
          open={showSellNFTDialog}
          title="Sell NFT"
          onClose={() => setShowSellNFTDialog(false)}
        >
          <SellNFTForm setShowSellNFTDialog={setShowSellNFTDialog} />
        </Dialog>
      )}
    </div>
  );
};

export default Header;
