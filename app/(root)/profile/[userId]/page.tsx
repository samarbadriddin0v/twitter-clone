import ProfileBio from "@/components/profile/profile-bio";
import ProfileHero from "@/components/profile/profile-hero";
import Header from "@/components/shared/header";
import PostFeed from "@/components/shared/post-feed";
import { getUserById } from "@/lib/actions/user.action";
import { authOptions } from "@/lib/auth-options";
import { getServerSession } from "next-auth";
import React from "react";

const Page = async ({ params }: { params: { userId: string } }) => {
  const session: any = await getServerSession(authOptions);
  const user = await getUserById(params.userId);

  return (
    <>
      <Header label={user.name} isBack />
      <ProfileHero user={JSON.parse(JSON.stringify(user))} />
      <ProfileBio
        user={JSON.parse(JSON.stringify(user))}
        userId={JSON.parse(JSON.stringify(session)).currentUser._id}
      />
      <PostFeed
        userId={params.userId}
        user={JSON.parse(JSON.stringify(session.currentUser))}
      />
    </>
  );
};

export default Page;
