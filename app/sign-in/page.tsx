// app/sign-in/page.tsx
import { SignIn } from "@clerk/nextjs";

export default function SignInPage() {
  return (
    <div className="flex items-center justify-center w-full h-screen">
      <SignIn
        routing="path" // use a full page, not a modal
        path="/sign-in" // matches /sign-in
        fallbackRedirectUrl="/dashboard/image-upload" // after success
        forceRedirectUrl="/dashboard/image-upload" // after success
      />
    </div>
  );
}
