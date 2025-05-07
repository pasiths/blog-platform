"use client";

import UserBlogDetails from "@/components/user/user-blogs-details";
import UserDetails from "@/components/user/user-details";
import { useEffect, useState } from "react";

interface User {
  id: number;
  full_name: string;
  username: string;
  email: string;
  password: string;
  image: string;
  bio: string;
  website: string;
  location: string;
  linkedin: string;
  instagram: string;
  youtube: string;
  github: string;
  x: string;
}

interface Blogs {
  id: number;
  title: string;
  slug: string;
  description: string;
  content: string;
  image: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  User: {
    full_name: string;
  };
  Comment: [];
  Like: [];
  Tag: {
    id: number;
    name: string;
  }[];
  Category: {
    id: number;
    name: string;
  }[];
}
const UserProfile = ({
  id,
  currentUserId,
}: {
  id: string;
  currentUserId: string;
}) => {
  const [loadingScreen, setLoadingScreen] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const [blogs, setBlogs] = useState<Blogs[]>([]);

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const res = await fetch(`/api/users/${id}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });
        if (!res.ok) {
          return null;
        }
        const data = await res.json();
        setUser(data);
        setBlogs(data.Post);
      } catch (error) {
        console.error("Error fetching user details:", error);
      } finally {
        setLoadingScreen(false);
      }
    };

    fetchUserDetails();
  }, [id]);

  return (
    <div className="flex w-full gap-4 items-start px-4">
      <div className="max-w-sm min-w-sm">
        <UserDetails
          user={user}
          loading={loadingScreen}
          currentUserId={currentUserId}
          onUpdate={setUser}
        />
      </div>
      <div className="px-4  w-full">
        <UserBlogDetails blogs={blogs} loading={loadingScreen} />
      </div>
    </div>
  );
};

export default UserProfile;
