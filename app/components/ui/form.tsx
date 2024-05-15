import React, { ReactNode } from "react";
import Skeleton from "./skeleton";

interface FormProps {
  className?: string;
  children?: ReactNode;
  loading?: boolean;
  onSubmit?: (e: React.FormEvent<HTMLFormElement>) => void;
  onReset?: (e: React.FormEvent<HTMLFormElement>) => void;
}

const Form = ({
  className,
  children,
  loading = false,
  onSubmit,
  onReset,
}: FormProps) => {
  return (
    <form className={`p-4 ${className}`} onSubmit={onSubmit} onReset={onReset}>
      <div className="flex flex-col gap-4">
        {loading ? <Skeleton /> : children}
        <button className="hidden" />
      </div>
    </form>
  );
};

export default Form;
