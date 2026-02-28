'use client';

import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Loader2, Sparkles } from 'lucide-react';

const formSchema = z.object({
  environmentType: z.string().min(3, 'Environment type is required.'),
  coverageAreaDimensions: z.object({
    length: z.coerce.number().min(1, 'Length must be at least 1m.'),
    width: z.coerce.number().min(1, 'Width must be at least 1m.'),
    height: z.coerce.number().optional(),
  }),
  desiredAccuracyMeters: z.coerce.number().min(0.1, 'Accuracy must be at least 0.1m.').max(5),
  potentialInterferenceSources: z.string().min(1, 'Please list interference sources or "none".'),
  existingInfrastructure: z.string().min(1, 'Please list infrastructure or "none".'),
});

export type AiConfiguratorFormValues = z.infer<typeof formSchema>;

interface AiConfiguratorFormProps {
  isLoading: boolean;
  onSubmit: SubmitHandler<AiConfiguratorFormValues>;
}

export function AiConfiguratorForm({ isLoading, onSubmit }: AiConfiguratorFormProps) {
  const form = useForm<AiConfiguratorFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      environmentType: 'Indoor Office',
      coverageAreaDimensions: { length: 20, width: 15, height: 3 },
      desiredAccuracyMeters: 0.5,
      potentialInterferenceSources: 'Wi-Fi routers, concrete walls',
      existingInfrastructure: 'Power outlets every 5m',
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <FormField control={form.control} name="environmentType" render={({ field }) => (
                <FormItem>
                    <FormLabel>Environment Type</FormLabel>
                    <FormControl><Input placeholder="e.g., Indoor Warehouse" {...field} /></FormControl>
                    <FormMessage />
                </FormItem>
            )} />
            <FormField control={form.control} name="desiredAccuracyMeters" render={({ field }) => (
                <FormItem>
                    <FormLabel>Desired Accuracy (m)</FormLabel>
                    <FormControl><Input type="number" step="0.1" {...field} /></FormControl>
                    <FormMessage />
                </FormItem>
            )} />
        </div>
        
        <div className="grid grid-cols-3 gap-4 rounded-md border p-4">
            <FormField control={form.control} name="coverageAreaDimensions.length" render={({ field }) => (
                <FormItem><FormLabel>Length</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>
            )} />
            <FormField control={form.control} name="coverageAreaDimensions.width" render={({ field }) => (
                <FormItem><FormLabel>Width</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>
            )} />
            <FormField control={form.control} name="coverageAreaDimensions.height" render={({ field }) => (
                <FormItem><FormLabel>Height</FormLabel><FormControl><Input type="number" placeholder="Optional" {...field} /></FormControl><FormMessage /></FormItem>
            )} />
        </div>

        <FormField control={form.control} name="potentialInterferenceSources" render={({ field }) => (
            <FormItem>
                <FormLabel>Interference Sources</FormLabel>
                <FormControl><Input placeholder="Comma-separated, e.g., metal racks" {...field} /></FormControl>
                <FormMessage />
            </FormItem>
        )} />

        <FormField control={form.control} name="existingInfrastructure" render={({ field }) => (
            <FormItem>
                <FormLabel>Existing Infrastructure</FormLabel>
                <FormControl><Input placeholder="Comma-separated, e.g., power outlets" {...field} /></FormControl>
                <FormMessage />
            </FormItem>
        )} />

        <Button type="submit" disabled={isLoading} className="w-full">
          {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
          Generate Recommendation
        </Button>
      </form>
    </Form>
  );
}
