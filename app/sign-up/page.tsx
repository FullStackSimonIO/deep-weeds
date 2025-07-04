// app/sign-up/page.tsx
import { SignUp } from "@clerk/nextjs";

export default function SignUpPage() {
  return (
    <div className="flex items-center justify-center w-full h-screen">
      <SignUp
        routing="path"
        path="/sign-up"
        fallbackRedirectUrl="/dashboard/image-upload"
        forceRedirectUrl="/dashboard/image-upload"
      />
    </div>
  );
}
