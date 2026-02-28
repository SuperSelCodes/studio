import { Waves } from 'lucide-react';

export function DashboardHeader() {
  return (
    <div className="flex items-center gap-3">
      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
        <Waves className="h-6 w-6 text-primary-foreground" />
      </div>
      <h1 className="text-2xl font-bold tracking-tight text-foreground">
        RSTI Sense
      </h1>
    </div>
  );
}
