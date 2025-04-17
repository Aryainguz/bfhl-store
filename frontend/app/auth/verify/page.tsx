"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { REGEXP_ONLY_DIGITS_AND_CHARS } from "input-otp";

import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import NavBar from "@/components/navbar";
import Footer from "@/components/footer";
import { ArrowRight } from "lucide-react";

export default function OTPVerificationPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [otp, setOtp] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);

  const [signupData, setSignupData] = useState<{
    email: string;
    password: string;
    name: string;
  } | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem("registrationData");
    if (!stored) {
      toast({
        title: "Missing Data",
        description: "Please sign up again.",
        variant: "error",
      });
      router.replace("/auth/signup");
      return;
    }

    try {
      const parsed = JSON.parse(stored);
      if (!parsed.email || !parsed.password || !parsed.name) throw new Error();
      setSignupData(parsed);
    } catch {
      toast({
        title: "Corrupted Data",
        description: "Please sign up again.",
        variant: "error",
      });
      router.replace("/auth/signup");
    }
  }, [router, toast]);

  const handleVerify = async () => {
    if (otp.length !== 6 || !signupData) {
      toast({
        title: "Invalid OTP",
        description: "Please enter a 6-digit code and ensure data exists.",
        variant: "error",
      });
      return;
    }

    setIsVerifying(true);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/verify-otp`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: signupData.email,
            otp,
            password: signupData.password,
            name: signupData.name,
          }),
        }
      );

      const data = await res.json();

      if (!res.ok || !data.success) {
        toast({
          title: "Verification Failed",
          description: data.message || "Invalid OTP or expired session.",
          variant: "error",
        });
        return;
      }

      toast({
        title: "Verified!",
        description: "Your account has been verified.",
      });

      localStorage.removeItem("registrationData");
      router.push("/auth/login");
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Something went wrong.",
        variant: "error",
      });
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <NavBar />

      <main className="flex-grow container mx-auto px-4 py-12 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Verify OTP</CardTitle>
            <CardDescription>
              Enter the 6-digit code sent to your email
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            <div className="flex justify-center">
              <InputOTP
                maxLength={6}
                pattern={REGEXP_ONLY_DIGITS_AND_CHARS}
                value={otp}
                onChange={setOtp}
              >
                <InputOTPGroup className="gap-3">
                  <InputOTPSlot index={0} />
                  <InputOTPSlot index={1} />
                  <InputOTPSlot index={2} />
                  <InputOTPSlot index={3} />
                  <InputOTPSlot index={4} />
                  <InputOTPSlot index={5} />
                </InputOTPGroup>
              </InputOTP>
            </div>
          </CardContent>

          <CardFooter className="flex flex-col gap-4">
            <Button
              className="w-full"
              disabled={otp.length !== 6 || isVerifying}
              onClick={handleVerify}
            >
              {isVerifying ? "Verifying..." : "Verify Account"}
              {!isVerifying && <ArrowRight className="ml-2 h-4 w-4" />}
            </Button>

            <Button
              type="button"
              variant="outline"
              className="w-full"
              onClick={() => router.push("/auth/signup")}
            >
              Use different email
            </Button>
          </CardFooter>
        </Card>
      </main>

      <Footer />
    </div>
  );
}
