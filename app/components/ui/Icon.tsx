import Image, { ImageProps } from "next/image";
import Tooltip from "./tooltip";
import { Size } from "@/app/utils/ui-types";
import { SizeMapPx } from "@/app/utils/ui-constants";

export interface IconProps {
  className?: string;
  src: ImageProps["src"];
  size?: Size;
  height?: number;
  width?: number;
  alt: string;
  priority?: boolean;
  active?: boolean;
  onClick?: VoidFunction;
}

const Icon = ({
  className = "",
  src,
  size = "medium",
  height,
  width,
  alt,
  priority = false,
  active = false,
  onClick,
}: IconProps) => {
  const iconSize = SizeMapPx[size];
  const classes = `${onClick ? "cursor-pointer" : ""}`;

  return (
    <div
      className={`${
        active ? "bg-primary-300-light dark:bg-primary-300-dark" : ""
      } ${className}`}
    >
      <Tooltip text={alt}>
        <Image
          className={classes}
          src={src}
          alt={alt}
          height={height && width ? height : iconSize}
          width={height && width ? width : iconSize}
          priority={priority}
          onClick={onClick}
        />
      </Tooltip>
    </div>
  );
};

export default Icon;
