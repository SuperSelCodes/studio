'use client';

import { useRstiSenseStream } from '@/hooks/use-rsti-sense-stream';
import { DashboardHeader } from '@/components/dashboard/header';
import { PerformanceMetricsDisplay } from '@/components/dashboard/performance-metrics';
import { AssetMap } from '@/components/dashboard/asset-map';
import { EventLog } from '@/components/dashboard/event-log';
import { AiConfigurator } from '@/components/dashboard/ai-configurator';

export default function DashboardPage() {
  const { assets, metrics, eventLog } = useRstiSenseStream();

  return (
    <main className="flex min-h-screen flex-col p-4 md:p-8">
      <DashboardHeader />
      <div className="mt-6 flex-grow grid grid-cols-1 gap-6 lg:grid-cols-3 xl:grid-cols-4">
        {/* Main Content: Asset Map */}
        <div className="lg:col-span-2 xl:col-span-3">
          <AssetMap assets={assets} />
        </div>

        {/* Sidebar Content */}
        <div className="lg:col-span-1 xl:col-span-1 flex flex-col gap-6">
          <PerformanceMetricsDisplay metrics={metrics} />
          <AiConfigurator />
          <EventLog events={eventLog} />
        </div>
      </div>
    </main>
  );
}
