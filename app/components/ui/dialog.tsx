import { DialogSizeMapClasses } from "@/app/utils/ui-constants";
import { DialogSize } from "@/app/utils/ui-types";
import React from "react";
import Icon from "./Icon";
import Typography from "./typography";
import closeIcon from "@/public/icons/svg/close.svg";
import Button from "./button";

interface DialogProps {
  className?: string;
  size: DialogSize;
  open: boolean;
  title: string;
  yesTitle?: string;
  children: React.ReactNode;
  onYes?: VoidFunction;
  onClose: VoidFunction;
}

const Dialog = ({
  className = "",
  size,
  title,
  yesTitle = "",
  open,
  children,
  onYes,
  onClose,
}: DialogProps) => {
  const width = DialogSizeMapClasses[size];

  return (
    <div
      className={`${
        open ? "absolute" : "hidden"
      } top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 h-full w-full bg-black bg-opacity-75 overflow-hidden z-[1000]`}
    >
      <div
        className={`bg-primary-200-light dark:bg-primary-200-dark relative top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex flex-col gap-2  ${width} ${className}`}
      >
        <div className="bg-primary-100-light dark:bg-primary-100-dark flex items-center justify-between !w-full py-2 px-4">
          <Typography variant="p" text={title} />
          <Icon
            src={closeIcon}
            size="small"
            alt="Close dialog"
            onClick={onClose}
          />
        </div>

        <div className="flex-1 overflow-auto">{children}</div>

        {yesTitle && onYes && (
          <div className="bg-primary-100-light dark:bg-primary-100-dark flex justify-end py-2 px-4">
            <Button
              size="small"
              sizeMedium="medium"
              text={yesTitle}
              onClick={onYes}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default Dialog;
