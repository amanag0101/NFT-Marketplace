import React, { useEffect, useState } from "react";

export interface ToastProps {
  message: string;
  timeout?: number;
  type: "error" | "success";
}

const Toast: React.FC<ToastProps> = ({ message, timeout = 3000, type }) => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
    }, timeout);

    return () => {
      clearTimeout(timer);
    };
  }, [timeout]);

  return (
    <div
      className={`${
        type === "success" ? "bg-green" : "bg-red"
      } text-white fixed top-4 left-1/2 transform -translate-x-1/2 py-2 px-6 transition-opacity ${
        visible ? "opacity-100 z-[100000]" : "opacity-0"
      }`}
    >
      {message}
    </div>
  );
};

export default Toast;
