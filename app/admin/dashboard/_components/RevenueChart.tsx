'use client';

import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from 'recharts';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

import {
  ChartContainer,
  ChartTooltip,
  type ChartConfig,
} from '@/components/ui/chart';

import { formatPrice } from '@/lib/format';

interface RevenueChartProps {
  data: {
    name: string;
    total: number;
  }[];
  title?: string;
}

const chartConfig = {
  total: {
    label: 'فروش',
    color: 'var(--color-primary)',
  },
} satisfies ChartConfig;

export function RevenueChart({
  data,
  title = 'نمودار فروش',
}: RevenueChartProps) {
  return (
    <Card className="col-span-1 lg:col-span-full border-border/50 shadow-sm">
      <CardHeader>
        <CardTitle className="text-xl font-bold py-3">{title}</CardTitle>
        <CardDescription>
          مجموع فروش موفق در بازه زمانی انتخاب شده
        </CardDescription>
      </CardHeader>
      <CardContent className="px-2 sm:p-6 pt-4">
        <div
          className="h-87.5 w-full overflow-x-auto overflow-y-hidden"
          dir="ltr"
        >
          <div
            style={{
              minWidth: data.length > 12 ? '800px' : '100%',
              height: '100%',
            }}
          >
            <ChartContainer config={chartConfig} className="h-full w-full">
              <BarChart
                data={data}
                margin={{ top: 10, right: 10, left: 10, bottom: 20 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="var(--color-border)"
                  opacity={0.5}
                />
                <XAxis
                  dataKey="name"
                  stroke="var(--color-muted-foreground)"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  dy={10}
                />
                <YAxis
                  stroke="var(--color-muted-foreground)"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={value => `${value / 1000}k`}
                  dx={-10}
                  width={60}
                />
                <ChartTooltip
                  cursor={{ fill: 'var(--color-muted)', opacity: 0.4 }}
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div
                          className="bg-popover border border-border/50 p-3 rounded-lg shadow-xl text-right font-sans"
                          dir="rtl"
                        >
                          <p className="text-sm font-medium mb-2 text-muted-foreground">
                            {payload[0].payload.name}
                          </p>
                          <p className="text-primary font-bold">
                            {formatPrice(payload[0].value as number)}
                          </p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Bar
                  dataKey="total"
                  fill="var(--color-total)"
                  radius={[6, 6, 0, 0]}
                  maxBarSize={data.length > 30 ? 20 : 50}
                />
              </BarChart>
            </ChartContainer>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
