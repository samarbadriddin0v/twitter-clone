"use client";

import Header from "@/components/shared/header";
import Button from "@/components/ui/button";
import useNotifications from "@/hooks/useNotifications";
import { IPost } from "@/types";
import axios from "axios";
import { Loader2 } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

const Page = ({ params }: { params: { userId: string } }) => {
  const [isClearing, setIsClearing] = useState(false);

  const { data, isLoading, mutate } = useNotifications(params.userId);

  const onClear = async () => {
    try {
      setIsClearing(true);
      await axios.delete(`/api/notifications/${params.userId}`);
      mutate();
      setIsClearing(false);
    } catch (error) {
      console.log(error);
      setIsClearing(false);
    }
  };

  return (
    <>
      <Header isBack label="Notifications" />
      {isLoading ? (
        <div className="flex justify-center items-center h-24">
          <Loader2 className="animate-spin text-sky-500" />
        </div>
      ) : (
        <div className="flex flex-col">
          {data.length > 0 ? (
            data.map((notification: IPost) => (
              <div
                className="flex flex-row items-center p-6 gap-4 border-b-[1px] border-neutral-800"
                key={notification._id}
              >
                <Image
                  alt="logo"
                  src={"/images/x.svg"}
                  width={32}
                  height={32}
                />
                <p className="text-white">{notification.body}</p>
              </div>
            ))
          ) : (
            <div className="text-neutral-600 text-center p-6 text-xl">
              No notifications
            </div>
          )}

          {data?.length > 0 && (
            <div className="mt-4 flex justify-center">
              <Button
                outline
                label={"Clear all"}
                onClick={onClear}
                disabled={isClearing}
              />
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default Page;
