'use client';

import { OrderStatus } from '@prisma/client';
import { useState } from 'react';
import { toast } from 'sonner';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

import { updateOrderStatusAction } from '@/lib/actions/orders';

export function OrderStatusSelect({
  orderId,
  currentStatus,
}: {
  orderId: string;
  currentStatus: OrderStatus;
}) {
  const [loading, setLoading] = useState(false);

  const handleStatusChange = async (newStatus: OrderStatus) => {
    setLoading(true);
    try {
      const result = await updateOrderStatusAction(orderId, newStatus);
      if (result?.error) toast.error(result.error);
      else toast.success(result.success);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Select
      defaultValue={currentStatus}
      onValueChange={handleStatusChange}
      disabled={loading}
    >
      <SelectTrigger
        className="w-40 bg-background cursor-pointer h-8 text-xs font-bold"
        dir="rtl"
      >
        <SelectValue />
      </SelectTrigger>
      <SelectContent dir="rtl">
        <SelectItem
          value="PENDING"
          className="cursor-pointer text-yellow-600 font-medium"
        >
          در انتظار پرداخت
        </SelectItem>
        <SelectItem
          value="PAID"
          className="cursor-pointer text-blue-600 font-medium"
        >
          پرداخت شده
        </SelectItem>
        <SelectItem
          value="DELIVERED"
          className="cursor-pointer text-green-600 font-medium"
        >
          تحویل داده شده
        </SelectItem>
        <SelectItem
          value="CANCELLED"
          className="cursor-pointer text-red-600 font-medium"
        >
          لغو شده
        </SelectItem>
      </SelectContent>
    </Select>
  );
}
