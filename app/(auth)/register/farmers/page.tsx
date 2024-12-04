"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Logo } from '@/components/logo';
import { toast } from 'sonner';
import Link from 'next/link';
import { Home, Loader2 } from 'lucide-react';

export default function FarmerRegisterPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    try {
      const formData = new FormData(e.currentTarget);
      const data = {
        name: formData.get('name') as string,
        email: formData.get('email') as string,
        password: formData.get('password') as string,
        role: 'farmer',
        farmDetails: {
          farmName: formData.get('farmName') as string,
          location: formData.get('location') as string,
          description: formData.get('description') as string,
          products: (formData.get('products') as string).split(',').map(p => p.trim()),
        },
      };

      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.error || 'Registration failed');
      }

      toast.success('Farmer Account Created!', {
        description: 'Please sign in with your new account.',
      });
      
      router.push('/login');
    } catch (error) {
      console.error('Registration error:', error);
      toast.error('Registration failed', {
        description: error instanceof Error ? error.message : 'Please try again.',
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background relative">
      <Button
        variant="ghost"
        size="icon"
        className="absolute top-4 left-4 hover:scale-110 transition-transform"
        asChild
      >
        <Link href="/">
          <Home className="h-6 w-6" />
          <span className="sr-only">Home</span>
        </Link>
      </Button>

      <div className="w-full max-w-md p-8 space-y-6 bg-card rounded-xl shadow-lg">
        <div className="flex justify-center">
          <Logo />
        </div>
        <h1 className="text-2xl font-bold text-center">Register as a Farmer</h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="name" className="text-sm font-medium">
              Full Name
            </label>
            <Input
              id="name"
              name="name"
              required
              placeholder="Enter your full name"
              disabled={loading}
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-medium">
              Email
            </label>
            <Input
              id="email"
              name="email"
              type="email"
              required
              placeholder="Enter your email"
              disabled={loading}
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="password" className="text-sm font-medium">
              Password
            </label>
            <Input
              id="password"
              name="password"
              type="password"
              required
              placeholder="Choose a password"
              minLength={6}
              disabled={loading}
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="farmName" className="text-sm font-medium">
              Farm Name
            </label>
            <Input
              id="farmName"
              name="farmName"
              required
              placeholder="Enter your farm name"
              disabled={loading}
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="location" className="text-sm font-medium">
              Farm Location
            </label>
            <Input
              id="location"
              name="location"
              required
              placeholder="Enter farm location"
              disabled={loading}
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="products" className="text-sm font-medium">
              Products (comma-separated)
            </label>
            <Input
              id="products"
              name="products"
              required
              placeholder="e.g., Tomatoes, Carrots, Potatoes"
              disabled={loading}
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="description" className="text-sm font-medium">
              Farm Description
            </label>
            <Textarea
              id="description"
              name="description"
              required
              placeholder="Tell us about your farm"
              disabled={loading}
            />
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating account...
              </>
            ) : (
              'Register Farm'
            )}
          </Button>
        </form>

        <div className="text-center text-sm text-muted-foreground">
          Already have an account?{' '}
          <Link href="/login" className="text-primary hover:underline">
            Sign in here
          </Link>
        </div>
      </div>
    </div>
  );
}