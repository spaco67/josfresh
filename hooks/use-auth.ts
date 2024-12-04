import { signIn, signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function useAuth() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { data: session } = useSession();
  const router = useRouter();

  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      setError(null);

      const result = await signIn("credentials", {
        redirect: false,
        email,
        password
      });

      if (!result?.ok) {
        setError(result?.error || "Login failed");
        return false;
      }

      router.refresh();
      router.push(session?.user?.role === "farmer" ? "/dashboard" : "/marketplace");

      return true;
    } catch (error) {
      setError(error instanceof Error ? error.message : "An unexpected error occurred");
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (data: any) => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Registration failed");
      }

      // Automatically log in after successful registration
      return login(data.email, data.password);
    } catch (error) {
      setError(error instanceof Error ? error.message : "Registration failed");
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    await signOut({ callbackUrl: "/" });
  };

  return {
    user: session?.user,
    isAuthenticated: !!session,
    isLoading,
    error,
    login,
    register,
    logout,
  };
}