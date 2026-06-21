import { redirect } from 'next/navigation';

export default function PaymentRootPage() {
  redirect('/checkout');
}
