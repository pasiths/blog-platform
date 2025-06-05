"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "./ui/alert-dialog";

const AlertDialogButton = ({
  dialog,
  title,
  description,
  cancelbtn,
  actionbtn,
  action
}: {
  dialog: React.ReactNode;
  title: string;
  description: string;
  cancelbtn: string;
  actionbtn: string;
    action: () => void;
}) => {
  return (
      <AlertDialog>
        <AlertDialogTrigger asChild>
          {dialog}
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{title}</AlertDialogTitle>
            <AlertDialogDescription>{description}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{cancelbtn}</AlertDialogCancel>
            <AlertDialogAction onClick={action}>{actionbtn}</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
  );
};

export default AlertDialogButton;
