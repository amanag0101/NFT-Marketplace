import { SizeMapClasses, SizeMapClassesMd } from "@/app/utils/ui-constants";
import { Size } from "@/app/utils/ui-types";
import { ChangeEvent, FocusEvent, useState } from "react";

interface InputProps {
  className?: string;
  name: string;
  type: string;
  sizeMedium?: Size;
  size: Size;
  placeholder: string;
  autocomplete?: string;
  value?: string;
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
  onBlur?: (e: FocusEvent<any, Element>) => void;
}

const Input = ({
  className = "",
  name,
  type,
  size,
  sizeMedium = undefined,
  placeholder,
  autocomplete = "off",
  value = "",
  onChange = () => {},
  onBlur = () => {},
}: InputProps) => {
  const width = SizeMapClasses[size];
  const widthMedium = sizeMedium ? SizeMapClassesMd[sizeMedium] : "";

  const [focused, setFocused] = useState(false);

  return (
    <div className={`input relative ${className}`}>
      <label
        className={`absolute left-3 md:left-4 -top-2 text-xs transition-all duration-500 ${
          focused || value ? "opacity-100" : "opacity-0"
        }`}
        htmlFor={name}
      >
        {placeholder}
      </label>
      <input
        className={`bg-primary-300-light dark:bg-primary-300-dark placeholder-txt-secondary-light dark:placeholder-txt-secondary-dark hover:bg-hover-bg-light hover:dark:bg-hover-bg-dark focus:outline-none ${width} md:${widthMedium} w-full`}
        name={name}
        type={type}
        placeholder={focused ? "" : placeholder}
        autoComplete={autocomplete}
        onChange={onChange}
        onBlur={(e) => {
          setFocused(false);
          onBlur(e);
        }}
        onFocus={() => setFocused(true)}
        value={value}
      />
    </div>
  );
};

export default Input;
