import { TypographyVariant } from "@/app/utils/ui-types";

interface TypographyProps {
  variant: TypographyVariant;
  text: string;
  className?: string;
  onClick?: VoidFunction;
}

const Typography = ({ variant, text, className, onClick }: TypographyProps) => {
  const defaultClasses = {
    h1: "text-6xl",
    h2: "text-5xl",
    h3: "text-4xl",
    h4: "text-3xl",
    h5: "text-2xl",
    h6: "text-xl",
    p: "text-base",
    span: "text-base",
  };

  const classes = `${
    onClick
      ? "cursor-pointer hover:text-txt-secondary-light dark:hover:text-txt-secondary-dark"
      : ""
  } ${defaultClasses[variant]} ${className}`;

  switch (variant) {
    case "h1":
      return (
        <h1 className={classes} onClick={onClick}>
          {text}
        </h1>
      );
    case "h2":
      return (
        <h2 className={classes} onClick={onClick}>
          {text}
        </h2>
      );
    case "h3":
      return (
        <h3 className={classes} onClick={onClick}>
          {text}
        </h3>
      );
    case "h4":
      return (
        <h4 className={classes} onClick={onClick}>
          {text}
        </h4>
      );
    case "h5":
      return (
        <h5 className={classes} onClick={onClick}>
          {text}
        </h5>
      );
    case "h6":
      return (
        <h6 className={classes} onClick={onClick}>
          {text}
        </h6>
      );
    case "p":
      return (
        <p className={classes} onClick={onClick}>
          {text}
        </p>
      );
    case "span":
      return (
        <span className={classes} onClick={onClick}>
          {text}
        </span>
      );
    default:
      return null;
  }
};

export default Typography;
