export interface IUser {
  createdAt: Date;
  username: string;
  email: string;
  name: string;
  profileImage: string;
  coverImage: string;
  updatedAt: Date;
  _id: string;
  bio: string;
  location: string;
  followers: string[];
  following: string[];
  hasNewNotifications: boolean;
  notifications: string[];
  isFollowing: boolean;
}

export interface IPost {
  body: string;
  comments: string[];
  createdAt: string;
  likes: string[];
  updatedAt: string;
  user: IUser;
  _id: string;
}
