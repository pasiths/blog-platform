"use client";

import { Button } from "../ui/button";
import { Link2, Mail, MapPin, X } from "lucide-react";
import { FaGithub, FaInstagram, FaLinkedin, FaYoutube } from "react-icons/fa";
import { Separator } from "../ui/separator";
import { Skeleton } from "../ui/skeleton";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Alert, AlertDescription } from "../ui/alert";

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
  currentUserId,
  onUpdate,
}: {
  user: User | null;
  loading: boolean;
  currentUserId: string;
  onUpdate?: (updatedUser: User) => void;
}) => {
  const [isEditor, setIsEditor] = useState<boolean>(false);
  const [isEditActive, setIsEditActive] = useState<boolean>(false);
  const [isSaving, setIsSaving] = useState<boolean>(false);

  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const [fullname, setFullName] = useState<string>("");
  const [bio, setBio] = useState<string>("");
  const [location, setLocation] = useState<string>("");
  const [website, setWebsite] = useState<string>("");
  const [linkedin, setLinkedin] = useState<string>("");
  const [instagram, setInstagram] = useState<string>("");
  const [youtube, setYoutube] = useState<string>("");
  const [github, setGithub] = useState<string>("");
  const [x, setX] = useState<string>("");

  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [imageUrl, setImageUrl] = useState<string>("");

  useEffect(() => {
    if (user) {
      setIsEditor(user.id === Number(currentUserId));
      setUserDetails(user);
    }
  }, [currentUserId, user]);

  const setUserDetails = (user: User | null) => {
    if (user) {
      setFullName(user.full_name);
      setBio(user.bio);
      setLocation(user.location);
      setWebsite(user.website);
      setLinkedin(user.linkedin);
      setInstagram(user.instagram);
      setYoutube(user.youtube);
      setGithub(user.github);
      setX(user.x);
      setImageUrl(user.image);
      setImagePreview(user.image);
    }
  };

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

  const handleEditClick = () => {
    if (isEditor) {
      setIsEditActive(!isEditActive);
      setUserDetails(user);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
      if (imagePreview) URL.revokeObjectURL(imagePreview);
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
    }
  };

  const removeImage = () => {
    if (imagePreview) URL.revokeObjectURL(imagePreview);
    setImage(null);
    setImagePreview("");
    setImageUrl("");
  };

  const uploadImage = async (): Promise<string | null> => {
    if (imagePreview === imageUrl) {
      return imageUrl;
    }
    if (!image) return null;

    const formData = new FormData();
    formData.append("file", image);

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        throw new Error("Image upload failed");
      }

      const data = await res.json();
      return data.url;
    } catch (err) {
      console.error("Image upload failed", err);
      return null;
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setError(null);
    setSuccess(null);

    try {
      const uploadImageUrl = await uploadImage();
      if (!uploadImageUrl) {
        setError("Image upload failed. Please try again.");
        setIsSaving(false);
        return;
      }
      const id = user?.id;
      const res = await fetch(`/api/users/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          full_name: fullname,
          bio: bio || "",
          location: location || "",
          website: website || "",
          linkedin: linkedin || "",
          instagram: instagram || "",
          youtube: youtube || "",
          github: github || "",
          x: x || "",
          image: uploadImageUrl || "",
        }),
      });
      if (!res.ok) {
        setError("Failed to save user details");
        return null;
      }
      const data = await res.json();
      onUpdate?.(data.newUser);
      setSuccess("User details saved successfully");
      setTimeout(async () => {
        setIsEditActive(false);
      }, 2000);
    } catch (error) {
      setError("Failed to save user details");
      console.error("Error saving user details", error);
    } finally {
      setTimeout(() => {
        setError(null);
        setSuccess(null);
        setIsSaving(false);
      }, 2000);
    }
  };

  if (isEditor && isEditActive) {
    return (
      <div className="flex flex-col px-2">
        <form onSubmit={handleSave} className="space-y-4">
          <div className="space-y-2">
            <div className="relative w-full min-h-60 group">
              <Avatar className="w-60 h-60 mx-auto rounded-full">
                <AvatarImage
                  src={imagePreview || imageUrl || undefined}
                  alt={fullname || ""}
                />
                <AvatarFallback className="text-7xl font-bold">
                  {fullname?.charAt(0).toLocaleUpperCase() || "U"}
                </AvatarFallback>
              </Avatar>
              <div
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 
                  flex flex-row items-center gap-2 z-20 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <div>
                  <input
                    type="file"
                    id="fileInput"
                    className="hidden"
                    onChange={handleImageChange}
                    disabled={isSaving}
                  />
                  <Button
                    className="w-20 cursor-pointer"
                    variant="outline"
                    onClick={() =>
                      document.getElementById("fileInput")?.click()
                    }
                    type="button"
                    disabled={isSaving}
                  >
                    Upload
                  </Button>
                </div>
                <Button
                  className="w-20 cursor-pointer"
                  variant="destructive"
                  onClick={removeImage}
                  type="button"
                  disabled={isSaving}
                >
                  Remove
                </Button>
              </div>
            </div>

            <div className="space-y-1">
              <Label className="text-sm text-muted-foreground">Full Name</Label>
              <Input
                className="w-full"
                value={fullname}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Your full name"
                disabled={isSaving}
              />
            </div>
            <div className="space-y-1">
              <Label className="text-sm text-muted-foreground">Bio</Label>
              <Textarea
                className="w-full"
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                rows={7}
                placeholder="Your bio"
                disabled={isSaving}
              />
            </div>
            <div className="space-y-1">
              <Label className="text-sm text-muted-foreground">Location</Label>
              <Input
                className="w-full"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Your location"
                disabled={isSaving}
              />
            </div>

            <Separator className="w-full" />

            <h1 className="text-lg">Social accounts</h1>
            <div className="flex flex-row items-center gap-2">
              <Link2 size={18} className="text-muted-foreground" />
              <Input
                className="w-full"
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
                placeholder="Your website"
                disabled={isSaving}
              />
            </div>
            <div className="flex flex-row items-center gap-2">
              <FaLinkedin size={18} className="text-muted-foreground" />
              <Input
                className="w-full"
                value={linkedin}
                onChange={(e) => setLinkedin(e.target.value)}
                placeholder="Your LinkedIn profile"
                disabled={isSaving}
              />
            </div>
            <div className="flex flex-row items-center gap-2">
              <FaInstagram size={18} className="text-muted-foreground" />
              <Input
                className="w-full"
                value={instagram}
                onChange={(e) => setInstagram(e.target.value)}
                placeholder="Your Instagram profile"
                disabled={isSaving}
              />
            </div>
            <div className="flex flex-row items-center gap-2">
              <FaGithub size={18} className="text-muted-foreground" />
              <Input
                className="w-full"
                value={github}
                onChange={(e) => setGithub(e.target.value)}
                placeholder="Your GitHub profile"
                disabled={isSaving}
              />
            </div>
            <div className="flex flex-row items-center gap-2">
              <X size={18} className="text-muted-foreground" />
              <Input
                className="w-full"
                value={x}
                onChange={(e) => setX(e.target.value)}
                placeholder="Your X profile"
                disabled={isSaving}
              />
            </div>
            <div className="flex flex-row items-center gap-2">
              <FaYoutube size={18} className="text-muted-foreground" />
              <Input
                className="w-full"
                value={youtube}
                onChange={(e) => setYoutube(e.target.value)}
                placeholder="Your YouTube channel"
                disabled={isSaving}
              />
            </div>
          </div>
          <div className="">
            {(error || success) && (
              <Alert variant={error ? "destructive" : "default"}>
                <AlertDescription>{error ? error : success}</AlertDescription>
              </Alert>
            )}
          </div>
          <div className="flex flex-row items-center gap-2">
            <Button
              className="w-20 cursor-pointer"
              variant="default"
              type="submit"
              disabled={isSaving}
            >
              Save
            </Button>
            <Button
              onClick={handleEditClick}
              className="w-20 cursor-pointer"
              variant="outline"
              type="button"
              disabled={isSaving}
            >
              Cancel
            </Button>
          </div>
        </form>
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
        {isEditor && (
          <Button onClick={handleEditClick} className="w-full cursor-pointer">
            Edit profile
          </Button>
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
