import { Metadata } from 'next';
import { redirect } from 'next/navigation';

import { verifyPayment } from '@/lib/actions/payment';

import { PaymentResult } from './_components/PaymentResult';

export const metadata: Metadata = {
  title: 'نتیجه پرداخت',
};

type Props = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export default async function VerifyPaymentPage({ searchParams }: Props) {
  const resolvedParams = await searchParams;

  const trackId =
    typeof resolvedParams.trackId === 'string' ? resolvedParams.trackId : '';
  const success =
    typeof resolvedParams.success === 'string' ? resolvedParams.success : '0';
  const status =
    typeof resolvedParams.status === 'string' ? resolvedParams.status : '';

  if (!trackId) {
    redirect('/');
  }

  const result = await verifyPayment(trackId, success, status);

  return (
    <div className="container px-4 pb-12">
      <PaymentResult
        isSuccess={!!result.success}
        message={
          result.error || 'سفارش شما ثبت شد و در اسرع وقت ارسال خواهد شد.'
        }
        orderId={result.orderId}
      />
    </div>
  );
}
