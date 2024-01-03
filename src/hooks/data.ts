export interface Order {
  id: number;
  product: string;
}

export interface Data {
  orders: Order[];
}