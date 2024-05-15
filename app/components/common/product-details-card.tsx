"use client";

import Link from "next/link";
import Img from "../ui/img";
import Typography from "../ui/typography";
import Button from "../ui/button";

interface ProductDetailsCardProps {
  className?: string;
  imgSrc: string;
  imgAlt: string;
  name: string;
  description: string;
  price: number;
  showPrice?: boolean;
  showBuyButton?: boolean;
  onClickBuy?: VoidFunction;
}

const ProductDetailsCard = ({
  className = "",
  imgSrc,
  imgAlt,
  name,
  description,
  price,
  showPrice = true,
  showBuyButton = true,
  onClickBuy,
}: ProductDetailsCardProps) => {
  return (
    <div
      className={`relative bg-primary-100-light dark:bg-primary-100-dark flex flex-col gap-4 p-4 ${className}`}
    >
      <Link
        className="bg-primary-300-light dark:bg-primary-300-dark"
        href={imgSrc}
        target="_blank"
      >
        <Img className="m-auto h-52 w-52" src={imgSrc} alt={imgAlt} />
      </Link>

      <div className="w-full flex items-center">
        <Typography
          className="text-center flex-grow"
          variant="h6"
          text={name}
        />
      </div>

      <Link className="text-center" href={imgSrc} target="_blank">
        {description}
      </Link>

      <div className="w-full flex items-center justify-between">
        {showBuyButton && (
          <Button size="small" text="Buy" onClick={onClickBuy} />
        )}
        {showPrice && (
          <Typography
            className={`font-bold ${!showBuyButton ? "w-full text-right" : ""}`}
            variant="p"
            text={`${price} ETH`}
          />
        )}
      </div>
    </div>
  );
};

export default ProductDetailsCard;
