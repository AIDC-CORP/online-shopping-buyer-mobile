import { Product } from '../../types';

export interface ShoppingScreenProps {
  // Add any props that ShoppingScreen might need in the future
}

export interface ProductCardProps {
  product: Product;
}

export interface ProductListProps {
  products: Product[];
}

export interface Meal {
  name: string;
  dish: string;
  ingredients: string[];
}