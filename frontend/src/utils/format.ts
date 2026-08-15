export const formatPrice = (price: number) =>
  new Intl.NumberFormat('en-RW', { style: 'currency', currency: 'RWF', maximumFractionDigits: 0 }).format(
    price
  );

export const formatMileage = (mileage: number) => `${new Intl.NumberFormat('en-US').format(mileage)} km`;

export const whatsappNumber = () => import.meta.env.VITE_WHATSAPP_NUMBER || '250793810796';

export const buildWhatsAppLink = (message: string) =>
  `https://wa.me/${whatsappNumber()}?text=${encodeURIComponent(message)}`;

export const vehicleWhatsAppMessage = (brand: string, model: string, year: number) =>
  `Hello SKIMP Rwanda \u{1F44B} I'm interested in the ${brand} ${model} ${year} listed on your website. Please send me more details.`;

export const primaryImage = (images: { url: string; isPrimary: boolean }[] | undefined) => {
  if (!images || images.length === 0) return 'https://images.unsplash.com/photo-1494905998402-395d579af36f?auto=format&fit=crop&w=1200&q=80';
  return images.find((i) => i.isPrimary)?.url || images[0].url;
};
