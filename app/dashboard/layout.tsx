"use client";

import { useAuth } from "@/components/AuthContext";
import { Ticket, LogOut } from "@/components/icons";
import { Button } from "@heroui/button";
import { useRouter } from "next/navigation";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, logout } = useAuth();

  return (
    <main>
      {" "}
      <header className="border-b border-border bg-card shadow-sm sticky top-0 z-50">
        <div className="mx-auto max-w-[1440px] px-4 py-4 md:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-primary to-blue-600 flex items-center justify-center shadow-md">
                <Ticket className="w-6 h-6 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-base sm:text-xl font-bold">
                  Ticket Manager
                </h1>
                <p className="text-xs sm:text-sm text-muted-foreground">
                  Welcome back, {user?.email.split("@")[0]}!
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button
                color="danger"
                size="sm"
                variant="bordered"
                onPress={logout}
              >
                <LogOut className="w-4 h-4 mr-2" />
                <span className="hidden sm:block"> Logout</span>
              </Button>
            </div>
          </div>
        </div>
      </header>
      {children}
    </main>
  );
}
