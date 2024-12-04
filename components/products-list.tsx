'use client';

import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Edit, Trash2 } from 'lucide-react';
import Link from 'next/link';

interface Product {
  _id: string;
  name: string;
  price: number;
  unit: string;
  stock: number;
  status: string;
}

export function ProductsList({ products }: { products: Product[] }) {
  return (
    <div className="grid gap-4">
      {products.map((product) => (
        <Card key={product._id} className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium">{product.name}</h3>
              <p className="text-sm text-muted-foreground">
                ₦{product.price} per {product.unit} • {product.stock} in stock
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon" asChild>
                <Link href={`/dashboard/products/${product._id}/edit`}>
                  <Edit className="h-4 w-4" />
                  <span className="sr-only">Edit</span>
                </Link>
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="text-red-500 hover:text-red-600"
              >
                <Trash2 className="h-4 w-4" />
                <span className="sr-only">Delete</span>
              </Button>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
} 