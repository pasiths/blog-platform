"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { FaGithub, FaInstagram, FaLinkedin, FaYoutube } from "react-icons/fa";
import { Link2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

const SettingCom = () => {
  return (
    <div className="space-y-4">
      <div className="">
        <h1 className="text-4xl font-bold">Settings</h1>
      </div>
      <div className="space-y-2 px-4">
        <h1 className="text-2xl font-bold">Public profile</h1>
        <form className="space-y-4 px-4">
          <div className="flex items-center justify-between gap-3">
            <div className="relative w-ful min-h-60 group">
              <Avatar className="w-60 h-60 mx-auto rounded-full">
                <AvatarImage src={undefined} alt={""} />
                <AvatarFallback className="text-7xl font-bold">
                  {"U"}
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-row items-center gap-2 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 opacity-0 group-hover:opacity-100 transition-opacity">
                <Button
                  className="w-20 cursor-pointer"
                  variant="default"
                  type="submit"
                  disabled={false}
                >
                  Upload
                </Button>
                <Button
                  className="w-20 cursor-pointer"
                  variant="default"
                  type="submit"
                  disabled={false}
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
                <Input className="" />
              </div>
              <div className="space-y-2">
                <Label className="text-sm text-muted-foreground">Email</Label>
                <Input className="" />
              </div>
              <div className="space-y-2">
                <Label className="text-sm text-muted-foreground">
                  Username
                </Label>
                <Input className="" />
              </div>
            </div>
          </div>
          <Separator className="w-full" />
          <div className="space-y-4 w-full">
            <div className="space-y-2">
              <Label className="">Bio</Label>
              <Textarea className="" />
            </div>
            <div className="space-y-2">
              <Label className="">location</Label>
              <Input className="w-full" />
            </div>
            <Separator className="" />
            <h1 className="text-xl font-bold">Social accounts</h1>
            <div className="space-y-2 pl-4">
              <div className="flex items-center gap-2">
                <Link2 size={20} className="text-muted-foreground" />
                <Input className="" />
              </div>
              <div className="flex items-center gap-2">
                <FaLinkedin size={20} className="text-muted-foreground" />
                <Input className="" />
              </div>
              <div className="flex items-center gap-2">
                <FaInstagram size={20} className="text-muted-foreground" />
                <Input className="" />
              </div>
              <div className="flex items-center gap-2">
                <FaGithub size={20} className="text-muted-foreground" />
                <Input className="" />
              </div>
              <div className="flex items-center gap-2">
                <X size={20} className="text-muted-foreground" />
                <Input className="" />
              </div>
              <div className="flex items-center gap-2">
                <FaYoutube size={18} className="text-muted-foreground" />
                <Input className="" />
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              className="w-40 cursor-pointer"
              variant="default"
              type="submit"
              disabled={false}
            >
              Update Profile
            </Button>
            <Button
              className="w-40 cursor-pointer"
              variant="default"
              type="submit"
              disabled={false}
            >
              Cancel
            </Button>
          </div>
        </form>
      </div>
      <Separator className="w-full" />
      <div className="space-y-2 px-4">
        <h1 className="text-2xl font-bold">Change password</h1>
        <form className="space-y-4 px-4">
          <div className="space-y-2">
            <Label className="text-sm text-muted-foreground">
              Old password
            </Label>
            <Input className="w-full" />
          </div>
          <div className="space-y-2">
            <Label className="text-sm text-muted-foreground">
              New password
            </Label>
            <Input className="w-full" />
          </div>
          <div className="space-y-2">
            <Label className="text-sm text-muted-foreground">
              Confirm new password
            </Label>
            <Input className="w-full" />
          </div>
          <div className="flex items-center gap-2">
            <Button
              className="w-40 cursor-pointer"
              variant="default"
              type="submit"
              disabled={false}
            >
              Update Password
            </Button>
            <Button
              className="w-40 cursor-pointer"
              variant="default"
              type="submit"
              disabled={false}
            >
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SettingCom;
