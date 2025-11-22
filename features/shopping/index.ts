import { Product } from '../../types';
import { ProductsByStore } from '../../services/catalog/CatalogService';

export interface ShoppingScreenProps {
  // Add any props that ShoppingScreen might need in the future
}

export interface ProductCardProps {
  product: Product;
}

export interface ProductListProps {
  products: ProductsByStore[];
}

export interface Meal {
  name: string;
  dish: string;
  ingredients: string[];
}

