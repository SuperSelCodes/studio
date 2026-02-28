import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { PerformanceMetrics } from '@/lib/types';
import { Gauge, Target, Wifi } from 'lucide-react';

interface PerformanceMetricsProps {
  metrics: PerformanceMetrics;
}

export function PerformanceMetricsDisplay({ metrics }: PerformanceMetricsProps) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 lg:grid-cols-1">
      <MetricCard
        title="Latency"
        value={`${metrics.latency}ms`}
        icon={<Gauge className="h-5 w-5 text-muted-foreground" />}
        description="< 200ms Target"
        isGood={metrics.latency < 200}
      />
      <MetricCard
        title="Precision"
        value={`${metrics.precision}m`}
        icon={<Target className="h-5 w-5 text-muted-foreground" />}
        description="< 0.5m Target"
        isGood={metrics.precision < 0.5}
      />
      <MetricCard
        title="Reliability"
        value={`${metrics.reliability}%`}
        icon={<Wifi className="h-5 w-5 text-muted-foreground" />}
        description="> 99% Target"
        isGood={metrics.reliability > 99}
      />
    </div>
  );
}

interface MetricCardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
  description: string;
  isGood: boolean;
}

function MetricCard({ title, value, icon, description, isGood }: MetricCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className={'text-xs text-muted-foreground'}>
            <span className={`mr-1 inline-block h-2 w-2 rounded-full ${isGood ? 'bg-accent' : 'bg-destructive'}`}></span>
            {description}
        </p>
      </CardContent>
    </Card>
  );
}
