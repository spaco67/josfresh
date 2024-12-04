export interface Product {
  id: string;
  name: string;
  price: number;
  unit: string;
  quantity: number;
  image: string;
  farmer: string;
  location: string;
}

export interface CartItem extends Product {
  cartQuantity: number;
}

export interface FarmerProduct extends Product {
  description: string;
  category: string;
  available: boolean;
}