export interface Brand {
  _id: string;
  name: string;
  slug: string;
  logo?: string;
  description?: string;
  featured?: boolean;
}

export interface ModelItem {
  _id: string;
  name: string;
  slug: string;
  brandId: string | Brand;
  bodyType: string;
}

export interface VehicleImage {
  url: string;
  isPrimary: boolean;
}

export interface Vehicle {
  _id: string;
  slug: string;
  brandId: Brand;
  modelId: ModelItem;
  year: number;
  price: number;
  mileage: number;
  fuel: 'Petrol' | 'Diesel' | 'Hybrid' | 'Electric';
  transmission: 'Automatic' | 'Manual';
  engine?: string;
  bodyType: string;
  color?: string;
  seats?: number;
  doors?: number;
  driveType?: string;
  location?: string;
  condition?: string;
  description?: string;
  features?: string[];
  images: VehicleImage[];
  status: 'Draft' | 'Available' | 'Reserved' | 'Sold';
  featured?: boolean;
  isDemo?: boolean;
  views?: number;
  createdAt?: string;
}

export interface VehicleFilters {
  page?: number;
  limit?: number;
  search?: string;
  brandId?: string;
  modelId?: string;
  minPrice?: number;
  maxPrice?: number;
  minYear?: number;
  maxYear?: number;
  bodyType?: string;
  fuel?: string;
  transmission?: string;
  maxMileage?: number;
  location?: string;
  sort?: string;
  status?: string;
}

export interface Paginated<T> {
  success: boolean;
  data: T[];
  pagination: { total: number; page: number; limit: number; pages: number };
}

export interface Article {
  _id: string;
  title: string;
  slug: string;
  category: string;
  coverImage?: string;
  excerpt?: string;
  content: string;
  author: string;
  readTime: number;
  published: boolean;
  createdAt?: string;
}

export interface Review {
  _id: string;
  customerName: string;
  vehiclePurchased?: string;
  rating: number;
  review: string;
  photo?: string;
  approved: boolean;
}

export interface Settings {
  whatsappNumber: string;
  phone: string;
  email: string;
  address: string;
  mapUrl?: string;
  instagramHandle?: string;
  facebookUrl?: string;
  businessHours?: Record<string, string>;
  homepageHero?: { title: string; subtitle: string };
  aboutContent?: string;
}

export interface Admin {
  id?: string;
  _id?: string;
  name: string;
  email: string;
  role: string;
}
