"use client";

import { Button } from "../ui/button";
import { Link2, Mail, MapPin, X } from "lucide-react";
import { FaGithub, FaInstagram, FaLinkedin, FaYoutube } from "react-icons/fa";
import { Separator } from "../ui/separator";
import { Skeleton } from "../ui/skeleton";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import Link from "next/link";

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

const UserDetails = ({
  user,
  loading,
  currentUserId
}: {
  user: User | null;
  loading: boolean;
  currentUserId: string;
}) => {
  if (loading) {
    return (
      <div className="flex flex-col px-2 space-y-2">
        <div className="space-y-4 mt-2">
          <div className="space-y-2">
            <div className="flex flex-col items-start w-full">
              <Skeleton className="w-60 h-60 mx-auto rounded-full mb-1" />
              <Skeleton className="w-80 h-6 mt-2" />
              <Skeleton className="w-40 h-4 mt-2" />
            </div>
            <Skeleton className="w-full h-24 mt-2" />
          </div>
          <Skeleton className="w-full h-8" />
        </div>
        <Separator className="w-full" />
        <div className="space-y-4 mb-2">
          <Skeleton className="w-40 h-6 mt-2" />
          <Skeleton className="w-40 h-6 mt-2" />
          <Skeleton className="w-40 h-6 mt-2" />
          <Skeleton className="w-40 h-6 mt-2" />
          <Skeleton className="w-40 h-6 mt-2" />
          <Skeleton className="w-40 h-6 mt-2" />
          <Skeleton className="w-40 h-6 mt-2" />
          <Skeleton className="w-40 h-6 mt-2" />
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col px-2 space-y-6">
      <div className="space-y-4 mt-2">
        <div className="space-y-2">
          <div className="flex flex-col items-start w-full">
            <div className="w-60 h-60 mx-auto rounded-full mb-1">
              <Avatar className="w-60 h-60 mx-auto rounded-full ">
                <AvatarImage
                  src={user?.image || undefined}
                  alt={user?.full_name || user?.username || ""}
                />
                <AvatarFallback className="text-7xl font-bold">
                  {user?.full_name?.charAt(0).toLocaleUpperCase() ||
                    user?.email?.charAt(0).toLocaleUpperCase() ||
                    "U"}
                </AvatarFallback>
              </Avatar>
            </div>
            <p className="text-2xl font-bold truncate w-full">
              {user?.full_name}
            </p>
            <span className="text-xl text-muted-foreground">
              {user?.username}
            </span>
          </div>
          {user?.bio && <p className="text-sm">{user?.bio} </p>}
        </div>

        {user?.id === Number(currentUserId) && (
          <Button className="w-full">Edit profile</Button>
        )}
      </div>
      <Separator className="w-full" />
      <div className="space-y-4 mb-2">
        {user?.location && (
          <p className="text-sm text-muted-foreground flex items-center gap-2">
            <MapPin size={14} />
            <span className="">{user.location}</span>
          </p>
        )}
        {user?.email && (
          <p className="text-sm text-muted-foreground cursor-pointer hover:underline">
            <Link
              href={`mailto:${user.email}`}
              target="_blank"
              className=" flex items-center gap-2"
            >
              <Mail size={14} />
              <span className="">{user.email}</span>
            </Link>
          </p>
        )}
        {user?.website && (
          <p className="text-sm text-muted-foreground cursor-pointer hover:underline">
            <Link
              href={user.website}
              target="_blank"
              className="flex items-center gap-2"
            >
              <Link2 size={14} />
              <span className="">{user.website}</span>
            </Link>
          </p>
        )}
        {user?.linkedin && (
          <p className="text-sm text-muted-foreground cursor-pointer hover:underline">
            <Link
              href={user.linkedin}
              target="_blank"
              className="flex items-center gap-2"
            >
              <FaLinkedin size={14} />
              <span className="">{user.linkedin}</span>
            </Link>
          </p>
        )}
        {user?.instagram && (
          <p className="text-sm text-muted-foreground cursor-pointer hover:underline">
            <Link
              href={user.instagram}
              target="_blank"
              className="flex items-center gap-2"
            >
              <FaInstagram size={14} />
              <span className="">{user.instagram}</span>
            </Link>
          </p>
        )}
        {user?.github && (
          <p className="text-sm text-muted-foreground cursor-pointer hover:underline">
            <Link
              href={user.github}
              target="_blank"
              className="flex items-center gap-2"
            >
              <FaGithub size={14} />
              <span className="">{user.github}</span>
            </Link>
          </p>
        )}
        {user?.x && (
          <p className="text-sm text-muted-foreground cursor-pointer hover:underline">
            <Link
              href={user.x}
              target="_blank"
              className="flex items-center gap-2"
            >
              <X size={14} />
              <span className="">{user.x}</span>
            </Link>
          </p>
        )}
        {user?.youtube && (
          <p className="text-sm text-muted-foreground cursor-pointer hover:underline">
            <Link
              href={user.youtube}
              target="_blank"
              className="flex items-center gap-2"
            >
              <FaYoutube size={14} />
              <span className="">{user.youtube}</span>
            </Link>
          </p>
        )}
      </div>
    </div>
  );
};

export default UserDetails;
