"use client";

import { IPost, IUser } from "@/types";
import axios from "axios";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import PostItem from "./post-item";

interface Props {
  userId: string;
  user: IUser;
}

const PostFeed = ({ userId, user }: Props) => {
  const [isLoading, setIsLoading] = useState(false);
  const [posts, setPosts] = useState<IPost[]>([]);

  const getPosts = async () => {
    try {
      setIsLoading(true);
      const { data } = await axios.get(`/api/users/posts/${userId}`);
      setPosts(data);
      setIsLoading(false);
    } catch (error) {
      console.log(error);
      setIsLoading(true);
    }
  };

  useEffect(() => {
    getPosts();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  return isLoading ? (
    <div className="flex justify-center items-center h-24">
      <Loader2 className="animate-spin text-sky-500" />
    </div>
  ) : (
    posts.map((post) => (
      <PostItem key={post._id} post={post} user={user} setPosts={setPosts} />
    ))
  );
};

export default PostFeed;
