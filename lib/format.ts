export function formatPrice(price: number): string {
  return new Intl.NumberFormat('fa-IR', {
    style: 'currency',
    currency: 'IRR',
    maximumFractionDigits: 0,
  })
    .format(price)
    .replace('IRR', 'ریال')
    .trim();
}
