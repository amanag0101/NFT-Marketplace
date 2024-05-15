interface TooltipProps {
  text: string;
  children: React.ReactNode;
}

const Tooltip = ({ text, children }: TooltipProps) => {
  return <div title={text}>{children}</div>;
};

export default Tooltip;
