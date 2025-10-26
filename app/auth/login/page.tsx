"use client";

import { Suspense, useState } from "react";
import { Link } from "@heroui/link";
import { Button } from "@heroui/button";
import { Input } from "@heroui/input";
import { Card, CardHeader, CardBody } from "@heroui/card";
import DecorativeCircle from "@/components/decorativeCircle";
import { Ticket } from "@/components/icons";
import { useAuth } from "@/components/AuthContext";
import { Form } from "@heroui/form";
import { Spinner } from "@heroui/spinner";

const Login = () => {
  const { signin, loading } = useAuth();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    signin({ email: formData.email, password: formData.password });
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <div className="flex-1 flex items-center justify-center p-4 relative overflow-hidden">
        <DecorativeCircle
          size="lg"
          position="top-left"
          color="primary"
          opacity={0.08}
        />
        <DecorativeCircle
          size="md"
          position="bottom-right"
          color="accent"
          opacity={0.08}
        />

        <Card className="w-full max-w-md shadow-xl border-2 border-border relative z-10">
          <CardHeader className="text-center space-y-2 flex-col ">
            <div className="mx-auto w-16 h-16 rounded-2xl bg-gradient-to-r from-primary to-blue-600 flex items-center justify-center mb-4 shadow-glow">
              <Ticket className="w-8 h-8 text-primary-foreground" />
            </div>
            <div>
              <h3 className="text-3xl font-bold">Welcome Back</h3>
              <p className="text-base">Sign in to your account to continue</p>
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
              />

              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    password: e.target.value,
                  }))
                }
                disabled={loading}
                label="Password"
              />

              <Button
                type="submit"
                className="w-full"
                color="primary"
                disabled={loading}
              >
                {loading && (
                  <Spinner
                    classNames={{
                      spinnerBars: "text-white bg-white",
                    }}
                    size="sm"
                    variant="spinner"
                  />
                )}
                {loading ? "Signing in..." : "Sign In"}
              </Button>
            </Form>

            <div className="mt-6 text-center text-sm">
              <span className="text-muted-foreground">
                Don't have an account?{" "}
              </span>
              <Link
                href="/auth/signup"
                className="text-primary font-medium hover:underline"
              >
                Sign up
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

export default Login;
