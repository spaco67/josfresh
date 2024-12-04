"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useCart } from "@/contexts/cart-context";
import { Minus, Plus, Trash2 } from "lucide-react";
import Link from "next/link";

export default function CartPage() {
  const { state, dispatch } = useCart();

  if (state.items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h2 className="text-2xl font-bold mb-4">Your cart is empty</h2>
        <p className="text-muted-foreground mb-8">
          Add some items from our marketplace to get started
        </p>
        <Button asChild>
          <Link href="/marketplace">Continue Shopping</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold mb-8">Shopping Cart</h2>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          {state.items.map((item) => (
            <Card key={item.id} className="p-4">
              <div className="flex gap-4">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-24 h-24 object-cover rounded"
                />
                <div className="flex-1">
                  <h3 className="font-semibold">{item.name}</h3>
                  <p className="text-sm text-muted-foreground">{item.farmer}</p>
                  <p className="text-sm text-muted-foreground">{item.location}</p>
                  <div className="mt-2 flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() =>
                          dispatch({
                            type: "UPDATE_QUANTITY",
                            payload: {
                              id: item.id,
                              quantity: item.cartQuantity - 1,
                            },
                          })
                        }
                        disabled={item.cartQuantity <= 1}
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                      <Input
                        type="number"
                        value={item.cartQuantity}
                        onChange={(e) =>
                          dispatch({
                            type: "UPDATE_QUANTITY",
                            payload: {
                              id: item.id,
                              quantity: parseInt(e.target.value) || 0,
                            },
                          })
                        }
                        className="w-20 text-center"
                        min={1}
                        max={item.quantity}
                      />
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() =>
                          dispatch({
                            type: "UPDATE_QUANTITY",
                            payload: {
                              id: item.id,
                              quantity: item.cartQuantity + 1,
                            },
                          })
                        }
                        disabled={item.cartQuantity >= item.quantity}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-destructive"
                      onClick={() =>
                        dispatch({ type: "REMOVE_ITEM", payload: item.id })
                      }
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold">
                    ₦{(item.price * item.cartQuantity).toFixed(2)}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    ₦{item.price} per {item.unit}
                  </p>
                </div>
              </div>
            </Card>
          ))}
        </div>
        <div className="lg:col-span-1">
          <Card className="p-4">
            <h3 className="font-semibold mb-4">Order Summary</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>₦{state.total.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Delivery Fee</span>
                <span>₦500.00</span>
              </div>
              <div className="border-t pt-2 mt-2">
                <div className="flex justify-between font-semibold">
                  <span>Total</span>
                  <span>₦{(state.total + 500).toFixed(2)}</span>
                </div>
              </div>
            </div>
            <Button className="w-full mt-4">Proceed to Checkout</Button>
          </Card>
        </div>
      </div>
    </div>
  );
}