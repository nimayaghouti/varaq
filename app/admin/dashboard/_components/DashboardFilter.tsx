'use client';

import { useRouter, useSearchParams } from 'next/navigation';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export function DashboardFilter() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentRange = searchParams.get('range') || '7d';

  const handleRangeChange = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('range', value);
    router.push(`/admin/dashboard?${params.toString()}`, { scroll: false });
  };

  return (
    <div className="flex items-center gap-2">
      <span className="text-sm font-medium text-muted-foreground whitespace-nowrap">
        بازه زمانی:
      </span>
      <Select defaultValue={currentRange} onValueChange={handleRangeChange}>
        <SelectTrigger
          className="w-35 h-9 bg-card cursor-pointer font-medium text-sm"
          dir="rtl"
        >
          <SelectValue placeholder="بازه زمانی" />
        </SelectTrigger>
        <SelectContent dir="rtl">
          <SelectItem value="24h" className="cursor-pointer">
            ۲۴ ساعت گذشته
          </SelectItem>
          <SelectItem value="7d" className="cursor-pointer">
            ۷ روز گذشته
          </SelectItem>
          <SelectItem value="30d" className="cursor-pointer">
            ۳۰ روز گذشته
          </SelectItem>
          <SelectItem value="1y" className="cursor-pointer">
            یک سال گذشته
          </SelectItem>
          <SelectItem value="all" className="cursor-pointer">
            همه
          </SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
