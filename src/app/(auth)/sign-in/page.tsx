import SignInForm from "@/components/auth/sign-in-form";

const SignIn = () => {
  return (
    <div className="container mx-auto px-4 w-screen min-h-[calc(100vh-8rem)] flex items-center justify-center">
      <div className="mx-auto flex w-full flex-col justify-center space-y-6">
        <div className="flex flex-col space-y-2 text-center">
          <h1 className="text-2xl font-semibold tracking-tight">
            Sign in to your account
          </h1>
          <p className="text-sm text-muted-foreground">
            Enter your email and password to sign in
          </p>
        </div>
        <SignInForm />
      </div>
    </div>
  );
};

export default SignIn;
