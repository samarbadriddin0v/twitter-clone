"use client";

import Form from "@/components/shared/form";
import Header from "@/components/shared/header";
import PostItem from "@/components/shared/post-item";
import usePosts from "@/hooks/usePosts";
import { IPost } from "@/types";
import axios from "axios";
import { Loader2 } from "lucide-react";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

export default function Page() {
  const { data: session, status }: any = useSession();
  const { data, isLoading } = usePosts();
  const [posts, setPosts] = useState<IPost[]>([]);

  useEffect(() => {
    if (data) {
      setPosts(data);
    }
  }, [data]);

  return (
    <>
      <Header label="Home" />
      {isLoading || status === "loading" ? (
        <div className="flex justify-center items-center h-24">
          <Loader2 className="animate-spin text-sky-500" />
        </div>
      ) : (
        <>
          <Form
            placeholder="What's on your mind?"
            user={JSON.parse(JSON.stringify(session.currentUser))}
            setPosts={setPosts}
          />
          {posts.map((post) => (
            <PostItem
              key={post._id}
              post={post}
              user={JSON.parse(JSON.stringify(session.currentUser))}
              setPosts={setPosts}
            />
          ))}
        </>
      )}
    </>
  );
}
