import { Size } from "../../utils/ui-types";
import { SizeMapClasses, SizeMapClassesMd } from "../../utils/ui-constants";
import Icon, { IconProps } from "./Icon";

interface ButtonProps {
  className?: string;
  size: Size;
  sizeMedium?: Size | null;
  type?: "button" | "submit" | "reset";
  text: string;
  iconProps?: IconProps;
  disabled?: boolean;
  onClick?: VoidFunction;
}

const Button = ({
  className = "",
  size,
  sizeMedium = null,
  type = "button",
  text,
  iconProps,
  disabled = false,
  onClick,
}: ButtonProps) => {
  const classesCommon = "button focus:outline-none focus:ring-1";
  const classesLight =
    "bg-primary-300-light hover:bg-hover-bg-light focus:ring-focus-border-light";
  const classesDark =
    "dark:bg-primary-300-dark hover:dark:bg-hover-bg-dark dark:focus:ring-focus-border-dark";
  const width = SizeMapClasses[size];
  const widthMedium = sizeMedium ? SizeMapClassesMd[sizeMedium] : "";

  return (
    <button
      className={`${classesCommon} ${classesLight} ${classesDark} ${width} md:${widthMedium} ${className}`}
      type={type}
      onClick={onClick}
      disabled={disabled}
    >
      <div
        className={`flex items-center ${
          iconProps?.src ? `justify-between gap-2` : "justify-center"
        }`}
      >
        {text}
        {iconProps?.src && <Icon {...iconProps} />}
      </div>
    </button>
  );
};

export default Button;
