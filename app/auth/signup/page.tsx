"use client";

import { useState } from "react";
import { Link } from "@heroui/link";
import { Button } from "@heroui/button";
import { Input } from "@heroui/input";
import { Card, CardHeader, CardBody } from "@heroui/card";
import DecorativeCircle from "@/components/decorativeCircle";
import { Ticket } from "@/components/icons";
import { useAuth } from "@/components/AuthContext";
import { Form } from "@heroui/form";
import { Spinner } from "@heroui/spinner";

const Signup = () => {
  const { signup, loading } = useAuth();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirm_password: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    signup({
      email: formData.email,
      password: formData.password,
      confirm_password: formData.confirm_password,
    });
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <div className="flex-1 flex items-center justify-center p-4 relative overflow-hidden">
        <DecorativeCircle
          size="lg"
          position="top-right"
          color="primary"
          opacity={0.08}
        />
        <DecorativeCircle
          size="md"
          position="bottom-left"
          color="accent"
          opacity={0.08}
        />

        <Card className="w-full max-w-md shadow-xl border-2 relative z-10 border-border">
          <CardHeader className="text-center space-y-2 flex-col">
            <div className="mx-auto w-16 h-16 rounded-2xl bg-gradient-to-r from-primary to-blue-600 flex items-center justify-center mb-4 shadow-glow">
              <Ticket className="w-8 h-8 text-primary-foreground" />
            </div>
            <div>
              <h3 className="text-3xl font-bold">Create Account</h3>
              <p className="text-base">
                Get started with your free account today
              </p>
            </div>
          </CardHeader>
          <CardBody>
            <Form onSubmit={handleSubmit} className="space-y-4">
              <Input
                id="email"
                type="email"
                placeholder="name@example.com"
                value={formData.email}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, email: e.target.value }))
                }
                disabled={loading}
                label="Email"
                validate={(value) => {
                  if (!value) {
                    return "Email is required";
                  } else if (!value.includes("@") || !value.includes(".")) {
                    return "Enter a valid email";
                  }
                }}
              />

              <Input
                id="password"
                type="password"
                placeholder="Enter your new password"
                value={formData.password}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    password: e.target.value,
                  }))
                }
                disabled={loading}
                label="Password"
                validate={(value) => {
                  if (!value) {
                    return "Password is required";
                  } else if (value.length < 8) {
                    return "Password length should be atleast 8 char";
                  }
                }}
              />

              <Input
                id="confirmPassword"
                type="password"
                placeholder="Confirm your password"
                value={formData.confirm_password}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    confirm_password: e.target.value,
                  }))
                }
                disabled={loading}
                label="Confirm Password"
                validate={(value) => {
                  if (!value) {
                    return "Confirm Password is required";
                  } else if (value !== formData.password) {
                    return "Password does not match";
                  }
                }}
              />

              <Button
                type="submit"
                className="w-full"
                disabled={loading}
                color="primary"
              >
                {loading && (
                  <Spinner
                    classNames={{
                      spinnerBars: "text-white bg-white",
                    }}
                    size="sm"
                    // color="danger"
                    variant="spinner"
                  />
                )}
                {loading ? "Creating account..." : "Create Account"}
              </Button>
            </Form>
            <div className="mt-6 text-center text-sm">
              <span className="text-muted-foreground">
                Already have an account?{" "}
              </span>
              <Link
                href="/auth/login"
                className="text-primary font-medium hover:underline"
              >
                Sign in
              </Link>
            </div>

            <div className="mt-4 text-center">
              <Link
                href="/"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                ← Back to home
              </Link>
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  );
};

export default Signup;
