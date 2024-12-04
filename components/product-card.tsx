"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Edit2, Trash2, Eye, EyeOff } from "lucide-react";
import Image from "next/image";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { useState } from "react";

interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  unit: string;
  stock: number;
  category: string;
  imageUrl: string;
  status: 'active' | 'draft' | 'outOfStock';
}

interface ProductCardProps {
  product: Product;
  onUpdate: () => void;
}

export function ProductCard({ product, onUpdate }: ProductCardProps) {
  const [isUpdating, setIsUpdating] = useState(false);

  async function toggleVisibility() {
    setIsUpdating(true);
    try {
      const res = await fetch(`/api/products/${product._id}/visibility`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          status: product.status === 'active' ? 'draft' : 'active'
        }),
      });

      if (!res.ok) throw new Error('Failed to update product visibility');

      toast.success(
        product.status === 'active' 
          ? 'Product hidden from marketplace' 
          : 'Product visible on marketplace'
      );
      onUpdate();
    } catch (error) {
      toast.error('Failed to update product visibility');
    } finally {
      setIsUpdating(false);
    }
  }

  return (
    <Card className="overflow-hidden">
      <div className="relative h-48 w-full">
        <Image
          src={product.imageUrl || '/placeholder-product.jpg'}
          alt={product.name}
          fill
          className="object-cover"
        />
      </div>
      <div className="p-4">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="font-semibold">{product.name}</h3>
            <p className="text-sm text-muted-foreground">{product.category}</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              {product.status === 'active' ? (
                <Eye className="h-4 w-4 text-green-500" />
              ) : (
                <EyeOff className="h-4 w-4 text-muted-foreground" />
              )}
              <Switch
                checked={product.status === 'active'}
                onCheckedChange={toggleVisibility}
                disabled={isUpdating}
              />
            </div>
            <div className="flex gap-2">
              <Button variant="ghost" size="icon">
                <Edit2 className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" className="text-red-500">
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
        <p className="mt-2 text-sm text-muted-foreground line-clamp-2">
          {product.description}
        </p>
        <div className="mt-4 flex justify-between items-center">
          <div className="font-semibold">₦{product.price.toLocaleString()}/{product.unit}</div>
          <div className="text-sm text-muted-foreground">{product.stock} in stock</div>
        </div>
      </div>
    </Card>
  );
} 