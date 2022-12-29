import { ReactNode } from "react";

type PanelCardProps = {
  children: ReactNode;
  backgroundColor?: string;
};

function PanelCard({ children, backgroundColor }: PanelCardProps) {
  return (
    <div
      className={`w-96 h-screen border-l-2 border-solid border-black bg-primaryBg`}
      style={{ backgroundColor }}
    >
      {children}
    </div>
  );
}

export default PanelCard;
