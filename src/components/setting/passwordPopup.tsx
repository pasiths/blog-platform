import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function PasswordPromptModal({
  isOpen,
  onClose,
  onSubmit,
  password,
  setPassword,
  confirmNewPassword,
  setConfirmNewPassword,
  isPasswordProtected,
  error
}: {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: () => void;
  password: string;
  setPassword: (val: string) => void;
  confirmNewPassword: string;
  setConfirmNewPassword: (val: string) => void;
  isPasswordProtected: boolean;
  error?: string | null;
}) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle>Enter Password</DialogTitle>
          <DialogDescription>
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-2">
          <Label className="text-sm text-muted-foreground">{!isPasswordProtected ? "New Password" : "Password"}
          </Label>
          <Input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoFocus
          />
        </div>

        {!isPasswordProtected && <div className="space-y-2">
          <Label className="text-sm text-muted-foreground">
            Confirm new password
          </Label>
          <Input
            className="w-full"
            type="password"
            value={confirmNewPassword}
            onChange={(e) => setConfirmNewPassword(e.target.value)}
            required={!isPasswordProtected}
          />
        </div>}
        {error && <p className="text-sm text-red-500">{error}</p>}
        <DialogFooter>
          <Button onClick={onSubmit} >
            Submit
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
