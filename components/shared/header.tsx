"use client";

import { useRouter } from "next/navigation";
import { BiArrowBack } from "react-icons/bi";

interface Props {
  label: string;
  isBack?: boolean;
}

const Header = ({ label, isBack }: Props) => {
  const router = useRouter();

  const handleBack = () => {
    router.back();
  };

  return (
    <div className="border-b-[1px] border-neutral-800 w-full p-5">
      <div className="flex flex-row items-center gap-2">
        {isBack && (
          <BiArrowBack
            onClick={handleBack}
            color={"white"}
            size={20}
            className={"cursor-pointer hover:opacity-70 transition"}
          />
        )}
        <h1 className="text-white text-xl font-semibold">{label}</h1>
      </div>
    </div>
  );
};

export default Header;
