"use client";

import { useState } from "react";
import Image from "next/image";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Loader2 } from "lucide-react";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  unit: string;
  stock: number;
  imageUrl: string;
  farmer: {
    name: string;
    farmDetails: {
      farmName: string;
      location: string;
    };
  };
}

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const { data: session } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handlePurchase() {
    if (!session) {
      router.push('/login');
      return;
    }

    try {
      setLoading(true);
      const res = await fetch('/api/marketplace/purchase', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          productId: product._id,
          quantity: 1,
          shippingAddress: session.user.shippingAddresses?.[0],
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      // Redirect to Paystack payment page
      window.location.href = data.data.authorization_url;
    } catch (error) {
      console.error('Purchase error:', error);
      toast.error('Failed to process purchase');
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card className="overflow-hidden">
      <div className="relative h-48">
        <Image
          src={product.imageUrl}
          alt={product.name}
          fill
          className="object-cover"
        />
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-lg mb-1">{product.name}</h3>
        <p className="text-sm text-muted-foreground mb-2 line-clamp-2">
          {product.description}
        </p>
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="font-bold text-lg">
              ₦{product.price.toLocaleString()}/{product.unit}
            </p>
            <p className="text-sm text-muted-foreground">
              {product.stock} in stock
            </p>
          </div>
        </div>
        <div className="text-sm text-muted-foreground mb-4">
          <p>Sold by: {product.farmer.farmDetails.farmName}</p>
          <p>Location: {product.farmer.farmDetails.location}</p>
        </div>
        <Button 
          className="w-full" 
          size="lg" 
          onClick={handlePurchase}
          disabled={loading || product.stock < 1}
        >
          {loading ? (
            <Loader2 className="h-4 w-4 animate-spin mr-2" />
          ) : (
            <ShoppingCart className="w-4 h-4 mr-2" />
          )}
          {product.stock < 1 ? 'Out of Stock' : 'Buy Now'}
        </Button>
      </div>
    </Card>
  );
} 