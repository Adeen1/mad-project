export interface Product {
  brand: string;
  created_at: string;
  description: string;
  image_url: string;
  name: string;
  price: number;
  product_id: number;
  quantity: number;
  resource: string;
}

export interface Cart {
  id: number;
  img: string;
  name: string;
  price: number;
  quantityItems: number;
}
