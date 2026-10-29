export type ProductId = 'basic_horoscope' | 'bronze_horoscope' | 'basic_voice' | 'silver_bundle' | 'gold_voice';
export type ServiceEntitlement = 'horoscope' | 'voice';

export interface Product {
  id: ProductId;
  name: string;
  amountInr: number;
  durationMonths: number | null;
  oneTimeViews: number | null;
  services: ServiceEntitlement[];
  summary: string;
  features: string[];
  support: string;
  category: 'Horoscope' | 'Voice' | 'Bundle';
}

export const PRODUCTS: Product[] = [
  { id: 'basic_horoscope', name: 'Basic Horoscope', amountInr: 1500, durationMonths: null, oneTimeViews: 1, services: ['horoscope'], category: 'Horoscope', summary: 'A single basic horoscope report purchase.', features: ['One horoscope report view (consumed when opened)'], support: 'Standard account support' },
  { id: 'bronze_horoscope', name: 'Bronze · Advanced Horoscope', amountInr: 5000, durationMonths: 4, oneTimeViews: null, services: ['horoscope'], category: 'Horoscope', summary: 'Advanced horoscope access for four calendar months.', features: ['Advanced horoscope service', 'Access for four calendar months'], support: 'Standard account support' },
  { id: 'basic_voice', name: 'Basic Voice Report', amountInr: 5000, durationMonths: 4, oneTimeViews: null, services: ['voice'], category: 'Voice', summary: 'Basic voice report with basic voice details for four calendar months.', features: ['Basic voice report and details', 'Access for four calendar months'], support: 'Standard account support' },
  { id: 'silver_bundle', name: 'Silver · Horoscope + Voice Bundle', amountInr: 9000, durationMonths: 4, oneTimeViews: null, services: ['horoscope', 'voice'], category: 'Bundle', summary: 'Advanced horoscope and basic voice report together for four months.', features: ['Advanced horoscope service', 'Basic voice report', '₹1,000 less than buying both ₹5,000 services separately'], support: 'Standard account support' },
  { id: 'gold_voice', name: 'Gold · Advanced Voice Analysis', amountInr: 25000, durationMonths: null, oneTimeViews: null, services: ['voice'], category: 'Voice', summary: 'Advanced voice analysis with astrology and personality insights, with lifetime support for the purchased report.', features: ['Advanced voice analysis', 'Astrology and personality insights', 'Lifetime support for the purchased report'], support: 'Lifetime support for the purchased report; no medical diagnosis or treatment advice' },
];

export const getProduct = (id: string) => PRODUCTS.find(product => product.id === id);

export function addCalendarMonths(date: Date, months: number): Date {
  const result = new Date(date);
  const day = result.getUTCDate();
  result.setUTCDate(1);
  result.setUTCMonth(result.getUTCMonth() + months);
  const lastDay = new Date(Date.UTC(result.getUTCFullYear(), result.getUTCMonth() + 1, 0)).getUTCDate();
  result.setUTCDate(Math.min(day, lastDay));
  return result;
}
