"use client";

import { CartItem, Product } from "@/types";
import { createContext, useContext, useReducer } from "react";
import { toast } from "sonner";

interface CartState {
  items: CartItem[];
  total: number;
}

type CartAction =
  | { type: "ADD_ITEM"; payload: Product; quantity?: number }
  | { type: "REMOVE_ITEM"; payload: string }
  | { type: "UPDATE_QUANTITY"; payload: { id: string; quantity: number } }
  | { type: "CLEAR_CART" };

const CartContext = createContext<{
  state: CartState;
  dispatch: React.Dispatch<CartAction>;
} | null>(null);

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case "ADD_ITEM": {
      const existingItem = state.items.find(
        (item) => item.id === action.payload.id
      );
      
      if (existingItem) {
        const quantity = (action.quantity || 1) + existingItem.cartQuantity;
        if (quantity > existingItem.quantity) {
          toast({
            title: "Maximum quantity reached",
            description: "Cannot add more than available stock"
          });
          return state;
        }
        
        return {
          ...state,
          items: state.items.map((item) =>
            item.id === action.payload.id
              ? { ...item, cartQuantity: quantity }
              : item
          ),
          total: state.total + action.payload.price * (action.quantity || 1),
        };
      }

      return {
        ...state,
        items: [
          ...state.items,
          { ...action.payload, cartQuantity: action.quantity || 1 },
        ],
        total: state.total + action.payload.price * (action.quantity || 1),
      };
    }
    case "REMOVE_ITEM":
      const itemToRemove = state.items.find(
        (item) => item.id === action.payload
      );
      return {
        ...state,
        items: state.items.filter((item) => item.id !== action.payload),
        total: state.total - (itemToRemove?.price || 0) * (itemToRemove?.cartQuantity || 0),
      };
    case "UPDATE_QUANTITY": {
      const item = state.items.find((item) => item.id === action.payload.id);
      if (!item) return state;
      
      if (action.payload.quantity > item.quantity) {
        toast({
          title: "Maximum quantity reached",
          description: "Cannot add more than available stock"
        });
        return state;
      }

      const quantityDiff = action.payload.quantity - item.cartQuantity;
      return {
        ...state,
        items: state.items.map((item) =>
          item.id === action.payload.id
            ? { ...item, cartQuantity: action.payload.quantity }
            : item
        ),
        total: state.total + item.price * quantityDiff,
      };
    }
    case "CLEAR_CART":
      return {
        items: [],
        total: 0,
      };
    default:
      return state;
  }
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, { items: [], total: 0 });

  return (
    <CartContext.Provider value={{ state, dispatch }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}