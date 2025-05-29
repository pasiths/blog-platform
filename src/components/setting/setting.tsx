/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { FaGithub, FaInstagram, FaLinkedin, FaYoutube } from "react-icons/fa";
import { Link2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { useEffect, useState } from "react";
import { Alert, AlertDescription } from "../ui/alert";
import { PasswordPromptModal } from "./passwordPopup";
import { signIn } from "next-auth/react";
import { Skeleton } from "../ui/skeleton";

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

export function SettingCom({ user }: { user: any }) {
  const [loadingScreen, setLoadingScreen] = useState(true);
  const [loading, setLoading] = useState<boolean>(false);

  const [pendingSave, setPendingSave] = useState(false);

  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [imageUrl, setImageUrl] = useState<string>("");

  const [fullName, setFullName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [username, setUsername] = useState<string>("");
  const [bio, setBio] = useState<string>("");
  const [location, setLocation] = useState<string>("");

  const [website, setWebsite] = useState<string>("");
  const [linkedin, setLinkedin] = useState<string>("");
  const [instagram, setInstagram] = useState<string>("");
  const [github, setGithub] = useState<string>("");
  const [x, setX] = useState<string>("");
  const [youtube, setYoutube] = useState<string>("");

  const [isPasswordProtected, setIsPasswordProtected] = useState<boolean>(false);

  const [currentPassword, setCurrentPassword] = useState<string>("");
  const [newPassword, setNewPassword] = useState<string>("");
  const [confirmNewPassword, setConfirmNewPassword] = useState<string>("");

  const [errorPassword, setErrorPassword] = useState<string | null>(null);

  const [errorChangePassword, setErrorChangePassword] = useState<string | null>(null);
  const [successChangePassword, setSuccessChangePassword] = useState<string | null>(null);

  const [passwordModalOpen, setPasswordModalOpen] = useState<boolean>(false);

  useEffect(() => {
    if (user) {
      setUserDetails(user);
    }
  }, [user]);

  const setUserDetails = async (user: User | null) => {
    if (user) {
      setLoading(true)
      try {
        const userDetailsResponse: Response = await fetch(
          `/api/users/${user.id}`
        );
        if (!userDetailsResponse.ok) {
          console.error("Failed to fetch user details");
          return;
        }
        const userData = await userDetailsResponse.json();
        setFullName(userData.full_name);
        setEmail(userData.email);
        setUsername(userData.username);
        setBio(userData.bio);
        setLocation(userData.location);
        setWebsite(userData.website);
        setLinkedin(userData.linkedin);
        setInstagram(userData.instagram);
        setYoutube(userData.youtube);
        setGithub(userData.github);
        setX(userData.x);
        setImageUrl(userData.image);
        setImagePreview(userData.image);
        setIsPasswordProtected(userData.isPsswdProtected)
      } catch (error) {
        console.error("Error setting user details:", error);
      } finally {
        setLoadingScreen(false);
        setLoading(false);
      }
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

  const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    // Check if username/email changed, show modal
    if (user?.username !== username || user?.email !== email) {
      setPasswordModalOpen(true);
      setPendingSave(true); // wait for modal submission
      return;
    }

    await performSave(); // otherwise, proceed directly
  };

  const performSave = async () => {
    setLoading(true);
    try {
      const uploadImageUrl = await uploadImage();
      if (!uploadImageUrl) {
        setError("Image upload failed. Please try again.");
        setLoading(false);
        return;
      }
      const id = user?.id;
      const res = await fetch(`/api/users/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          full_name: fullName,
          username: username,
          email: email,
          bio: bio || "",
          location: location || "",
          website: website || "",
          linkedin: linkedin || "",
          instagram: instagram || "",
          youtube: youtube || "",
          github: github || "",
          x: x || "",
          image: uploadImageUrl || "",
          password: newPassword || "",
          confirmPassword: confirmNewPassword || "",
        }),
      });
      if (!res.ok) {
        setError("Failed to save user details");
        return null;
      }
      setSuccess("User details saved successfully");
      setTimeout(async () => {
        if (user?.email !== email) {
          await signIn("credentials", {
            email,
            password: newPassword,
            callbackUrl: "/setting",
          });
        }
      }, 2000);
    } catch (error) {
      console.error("Error saving settings:", error);
      setError("Failed to save settings. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleMatchPassword = async () => {
    setErrorPassword(null);
    if (!isPasswordProtected && (newPassword === "" || confirmNewPassword === "")) {
      setErrorPassword("Password cannot be empty.");
      return;
    }
    if (!isPasswordProtected && newPassword !== confirmNewPassword) {
      setErrorPassword("New password and confirm password do not match.");
      return;
    }
    setPasswordModalOpen(false);
    setNewPassword("")
    setConfirmNewPassword("")
    if (pendingSave) {
      await performSave();
    }
  }

  const handleChangePassword = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setErrorChangePassword(null);
    setSuccessChangePassword(null);

    if (isPasswordProtected && currentPassword === "") {
      setErrorChangePassword("Current password is required.");
      setLoading(false);
      return;
    }
    if (newPassword === "" || confirmNewPassword === "") {
      setErrorChangePassword("New password and confirm password cannot be empty.");
      setLoading(false);

      return;
    }
    if (newPassword !== confirmNewPassword) {
      setErrorChangePassword("New password and confirm password do not match.");
      setLoading(false);

      return;
    }
    try {
      const res = await fetch("/api/auth/change-password", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          currentPassword: isPasswordProtected ? currentPassword : "",
          newPassword,
          confirmNewPassword,
        }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        setErrorChangePassword(errorData.message || "Failed to change password");
        setLoading(false);
        return;
      }

      setSuccessChangePassword("Password changed successfully");
      setTimeout(() => {
        window.location.reload();
      }, 2000);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmNewPassword("");
    }
    catch (error) {
      console.error("Error changing password:", error);
      setErrorChangePassword("Failed to change password. Please try again.");
    }
    finally {
      setLoading(false);
    }
  }

  if (loadingScreen) {
    return (
      <div className="space-y-4">
        <div className="">
          <Skeleton className="w-40 h-8" />
        </div>
        <div className="space-y-2 px-4">
          <Skeleton className="w-40 h-8" />
          <form className="space-y-4 px-4">
            <div className="flex items-center justify-between gap-3">
              <div className="relative w-ful min-h-60 group">
                <Skeleton className="w-60 h-60 mx-auto rounded-full" />
              </div>
              <div className="space-y-2 w-full">
                <div className="space-y-2">
                  <Skeleton className="w-20 h-4" />
                  <Skeleton className="w-full h-8" />
                </div>
                <div className="space-y-2">
                  <Skeleton className="w-20 h-4" />
                  <Skeleton className="w-full h-8" />
                </div>
                <div className="space-y-2">
                  <Skeleton className="w-20 h-4" />
                  <Skeleton className="w-full h-8" />
                </div>
              </div>
            </div>
            <Separator className="w-full" />
            <div className="space-y-4 w-full">
              <div className="space-y-2">
                <Skeleton className="w-20 h-4" />
                <Skeleton className="w-full h-16" />
              </div>
              <div className="space-y-2">
                <Skeleton className="w-20 h-4" />
                <Skeleton className="w-full h-8" />
              </div>
              <Separator className="" />
              <Skeleton className="w-40 h-8" />
              <div className="space-y-2 pl-4">
                <div className="flex items-center gap-2">
                  <Skeleton className="w-6 h-6" />
                  <Skeleton className="w-full h-8" />
                </div>
                <div className="flex items-center gap-2">
                  <Skeleton className="w-6 h-6" />
                  <Skeleton className="w-full h-8" />
                </div>
                <div className="flex items-center gap-2">
                  <Skeleton className="w-6 h-6" />
                  <Skeleton className="w-full h-8" />
                </div>
                <div className="flex items-center gap-2">
                  <Skeleton className="w-6 h-6" />
                  <Skeleton className="w-full h-8" />
                </div>
                <div className="flex items-center gap-2">
                  <Skeleton className="w-6 h-6" />
                  <Skeleton className="w-full h-8" />
                </div>
                <div className="flex items-center gap-2">
                  <Skeleton className="w-6 h-6" />
                  <Skeleton className="w-full h-8" />
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Skeleton className="w-40 h-8" />
              <Skeleton className="w-40 h-8" />
            </div>
          </form>
        </div>
        <Separator className="w-full" />
        <div className="space-y-2 px-4">
          <Skeleton className="w-50 h-8" />
          <form className="space-y-4 px-4">
            <Skeleton className="w-40 h-4" />
            <Skeleton className="w-full h-8" />
            <div className="space-y-2">
              <Skeleton className="w-40 h-4" />
              <Skeleton className="w-full h-8" />
            </div>
            <div className="space-y-2">
              <Skeleton className="w-40 h-4" />
              <Skeleton className="w-full h-8" />
            </div>
            <div className="flex items-center gap-2">
              <Skeleton className="w-40 h-8" />
              <Skeleton className="w-40 h-8" />
            </div>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="">
        <h1 className="text-4xl font-bold">Settings</h1>
      </div>
      <div className="space-y-2 px-4">
        <h1 className="text-2xl font-bold">Public profile</h1>
        <form onSubmit={handleSave} className="space-y-4 px-4">
          <div className="flex items-center justify-between gap-3">
            <div className="relative w-ful min-h-60 group">
              <Avatar className="w-60 h-60 mx-auto rounded-full">
                <AvatarImage
                  src={imagePreview || imageUrl || undefined}
                  alt={fullName || ""}
                />
                <AvatarFallback className="text-7xl font-bold">
                  {fullName?.charAt(0).toLocaleUpperCase() || "U"}
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-row items-center gap-2 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 opacity-0 group-hover:opacity-100 transition-opacity">
                <div>
                  <input
                    type="file"
                    id="fileInput"
                    className="hidden"
                    onChange={handleImageChange}
                    disabled={loading}
                  />
                  <Button
                    className="w-20 cursor-pointer"
                    variant="outline"
                    onClick={() =>
                      document.getElementById("fileInput")?.click()
                    }
                    type="button"
                    disabled={loading}
                  >
                    Upload
                  </Button>
                </div>
                <Button
                  className="w-20 cursor-pointer"
                  variant="destructive"
                  onClick={removeImage}
                  type="button"
                  disabled={loading}
                >
                  Remove
                </Button>
              </div>
            </div>
            <div className="space-y-2 w-full">
              <div className="space-y-2">
                <Label className="text-sm text-muted-foreground">
                  Full Name
                </Label>
                <Input
                  className=""
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  disabled={loading}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label className="text-sm text-muted-foreground">Email</Label>
                <Input
                  className=""
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={loading}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label className="text-sm text-muted-foreground">
                  Username
                </Label>
                <Input
                  className=""
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  disabled={loading}
                  required
                />
              </div>
            </div>
          </div>
          <Separator className="w-full" />
          <div className="space-y-4 w-full">
            <div className="space-y-2">
              <Label className="">Bio</Label>
              <Textarea
                className=""
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                disabled={loading}
              />
            </div>
            <div className="space-y-2">
              <Label className="">Location</Label>
              <Input
                className="w-full"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                disabled={loading}
              />
            </div>
            <Separator className="" />
            <h1 className="text-xl font-bold">Social accounts</h1>
            <div className="space-y-2 pl-4">
              <div className="flex items-center gap-2">
                <Link2 size={20} className="text-muted-foreground" />
                <Input
                  className=""
                  value={website}
                  onChange={(e) => setWebsite(e.target.value)}
                  placeholder="Website"
                  disabled={loading}
                />
              </div>
              <div className="flex items-center gap-2">
                <FaLinkedin size={20} className="text-muted-foreground" />
                <Input
                  className=""
                  value={linkedin}
                  onChange={(e) => setLinkedin(e.target.value)}
                  placeholder="LinkedIn"
                  disabled={loading}
                />
              </div>
              <div className="flex items-center gap-2">
                <FaInstagram size={20} className="text-muted-foreground" />
                <Input
                  className=""
                  value={instagram}
                  onChange={(e) => setInstagram(e.target.value)}
                  placeholder="Instagram"
                  disabled={loading}
                />
              </div>
              <div className="flex items-center gap-2">
                <FaGithub size={20} className="text-muted-foreground" />
                <Input
                  className=""
                  value={github}
                  onChange={(e) => setGithub(e.target.value)}
                  placeholder="GitHub"
                  disabled={loading}
                />
              </div>
              <div className="flex items-center gap-2">
                <X size={20} className="text-muted-foreground" />
                <Input
                  className=""
                  value={x}
                  onChange={(e) => setX(e.target.value)}
                  placeholder="X (Twitter)"
                  disabled={loading}
                />
              </div>
              <div className="flex items-center gap-2">
                <FaYoutube size={18} className="text-muted-foreground" />
                <Input
                  className=""
                  value={youtube}
                  onChange={(e) => setYoutube(e.target.value)}
                  placeholder="YouTube"
                  disabled={loading}
                />
              </div>
            </div>
          </div>
          <div className="">
            {(error || success) && (
              <Alert variant={error ? "destructive" : "default"}>
                <AlertDescription>{error ? error : success}</AlertDescription>
              </Alert>
            )}
          </div>
          <div className="flex items-center gap-2">
            <Button
              className="w-40 cursor-pointer"
              variant="default"
              type="submit"
              disabled={loading}
            >
              Update Profile
            </Button>
            <Button
              className="w-40 cursor-pointer"
              variant="default"
              type="button"
              onClick={() => setUserDetails(user)}
              disabled={loading}
            >
              Reset
            </Button>
          </div>
        </form>

        <PasswordPromptModal
          isOpen={passwordModalOpen}
          onClose={() => setPasswordModalOpen(false)}
          onSubmit={handleMatchPassword}
          password={newPassword}
          setPassword={setNewPassword}
          confirmNewPassword={confirmNewPassword}
          setConfirmNewPassword={setConfirmNewPassword}
          isPasswordProtected={isPasswordProtected}
          error={errorPassword}
        />

      </div>
      <Separator className="w-full" />
      <div className="space-y-2 px-4">
        <h1 className="text-2xl font-bold">{isPasswordProtected ? "Change password" : "Set Password"}</h1>
        <form onSubmit={handleChangePassword} className="space-y-4 px-4">
          {isPasswordProtected && <div className="space-y-2">
            <Label className="text-sm text-muted-foreground">
              Current password
            </Label>
            <Input
              className="w-full"
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              disabled={loading}
              required={!isPasswordProtected}
            />
          </div>}
          <div className="space-y-2">
            <Label className="text-sm text-muted-foreground">
              New password
            </Label>
            <Input
              className="w-full"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              disabled={loading}
              required
            />
          </div>
          <div className="space-y-2">
            <Label className="text-sm text-muted-foreground">
              Confirm new password
            </Label>
            <Input
              className="w-full"
              type="password"
              value={confirmNewPassword}
              onChange={(e) => setConfirmNewPassword(e.target.value)}
              disabled={loading}
              required
            />
          </div>
          <div className="">
            {(errorChangePassword || successChangePassword) && (
              <Alert variant={errorChangePassword ? "destructive" : "default"}>
                <AlertDescription>{errorChangePassword ? errorChangePassword : successChangePassword}</AlertDescription>
              </Alert>
            )}
          </div>
          <div className="flex items-center gap-2">
            <Button
              className="w-40 cursor-pointer"
              variant="default"
              type="submit"
              disabled={loading}
            >
              {isPasswordProtected ? "Update Password" : "Set Password"}
            </Button>
            <Button
              className="w-40 cursor-pointer"
              variant="default"
              type="button"
              onClick={() => { setCurrentPassword(""); setNewPassword(""); setConfirmNewPassword(""); }}
              disabled={loading}
            >
              Reset
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
