"use client";

import { useState } from "react";
import AlertDialogButton from "../alert-dialog-button";
import { Button } from "../ui/button";
import { toast } from "sonner";
import { PenLine } from "lucide-react";

const ReqWriter = ({
  id,
  variant,
  className,
}: {
  id: number;
  variant:
    | "link"
    | "default"
    | "destructive"
    | "outline"
    | "secondary"
    | "ghost"
    | null
    | undefined;
  className: string;
}) => {
  const [loading, setLoading] = useState(false);
  const handleSubmit = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/users/${id}/reqwriter`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({}),
      });

      if (!response.ok) {
        const errorData = await response.json();
        toast.error(errorData.error || "An error occurred");
        return;
      }

      toast.success("Request sent successfully");
    } catch (error) {
      console.debug(error);
      toast.error("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };
  return (
    <AlertDialogButton
      dialog={
        <Button variant={variant} className={className} disabled={loading}>
          <PenLine size={18} />
          Request Writer
        </Button>
      }
      title="Request to Become a Writer"
      description="You&#39;re about to send a request to upgrade your role. This action cannot be undone and will notify the administrators for review."
      cancelbtn="Cancel"
      actionbtn="Request"
      action={handleSubmit}
    />
  );
};

export default ReqWriter;
