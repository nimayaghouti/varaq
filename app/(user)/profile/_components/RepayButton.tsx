'use client';

import { CreditCard } from 'lucide-react';

import { useState } from 'react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';

import { rePayOrder } from '@/lib/actions/payment';

export function RepayButton({ orderId }: { orderId: string }) {
  const [loading, setLoading] = useState(false);

  const handleRepay = async () => {
    setLoading(true);
    try {
      const result = await rePayOrder(orderId);
      if (result?.error) {
        toast.error(result.error);
      } else if (result?.url) {
        toast.info('در حال انتقال به درگاه...');
        window.location.assign(result.url);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      size="sm"
      onClick={handleRepay}
      disabled={loading}
      className="gap-2 cursor-pointer mt-3 sm:mt-0"
    >
      <CreditCard className="size-4" />
      {loading ? 'لطفاً صبر کنید...' : 'پرداخت سفارش'}
    </Button>
  );
}
