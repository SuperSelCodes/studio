'use client';

import { useState } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Loader2, Sparkles } from 'lucide-react';
import { getAISensorRecommendation } from '@/app/actions';
import type { AiSensorConfigurationRecommendationOutput } from '@/ai/flows/ai-sensor-configuration-recommendation';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

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

type FormValues = z.infer<typeof formSchema>;

export function AiConfigurator() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<AiSensorConfigurationRecommendationOutput | null>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      environmentType: 'Indoor Office',
      coverageAreaDimensions: { length: 20, width: 15, height: 3 },
      desiredAccuracyMeters: 0.5,
      potentialInterferenceSources: 'Wi-Fi routers, concrete walls',
      existingInfrastructure: 'Power outlets every 5m',
    },
  });

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    setIsLoading(true);
    setError(null);
    setResult(null);

    const input = {
        ...data,
        potentialInterferenceSources: data.potentialInterferenceSources.split(',').map(s => s.trim()),
        existingInfrastructure: data.existingInfrastructure.split(',').map(s => s.trim()),
    };

    const response = await getAISensorRecommendation(input);
    if ('error' in response) {
      setError(response.error);
    } else {
      setResult(response);
    }
    setIsLoading(false);
  };

  return (
    <Card>
        <Accordion type="single" collapsible>
            <AccordionItem value="ai-configurator">
                <AccordionTrigger className="px-6">
                    <div className="text-left">
                        <CardTitle className="flex items-center gap-2">
                            <Sparkles className="h-5 w-5 text-accent" />
                            AI Sensor Configurator
                        </CardTitle>
                        <CardDescription className="mt-1">Get AI-powered recommendations for sensor placement.</CardDescription>
                    </div>
                </AccordionTrigger>
                <AccordionContent>
                    <div className="px-6 pb-6">
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
                        {error && (
                            <Alert variant="destructive" className="mt-4">
                                <AlertTitle>Error</AlertTitle>
                                <AlertDescription>{error}</AlertDescription>
                            </Alert>
                        )}
                        {result && <RecommendationResult result={result} />}
                    </div>
                </AccordionContent>
            </AccordionItem>
        </Accordion>
    </Card>
  );
}

function RecommendationResult({ result }: { result: AiSensorConfigurationRecommendationOutput }) {
    return (
        <div className="mt-6 space-y-4 text-sm">
            <h3 className="text-lg font-semibold text-foreground">Recommendation Details</h3>
            <Separator className="my-2" />
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="rounded-md border bg-card-foreground/5 p-4">
                    <p className="font-medium text-muted-foreground">Coverage Efficiency</p>
                    <p className="text-2xl font-bold text-accent">{result.expectedCoverageEfficiency}%</p>
                </div>
                <div className="rounded-md border bg-card-foreground/5 p-4">
                    <p className="font-medium text-muted-foreground">Interference Reduction</p>
                    <p className="text-2xl font-bold text-accent">{result.expectedInterferenceReduction}%</p>
                </div>
            </div>
            <div>
                <h4 className="font-semibold">Placement Plan</h4>
                <p className="whitespace-pre-wrap rounded-md bg-card-foreground/5 p-3 font-mono text-xs text-muted-foreground">{result.recommendedPlacementPlan}</p>
            </div>
            <div>
                <h4 className="font-semibold">Calibration Parameters</h4>
                <p className="whitespace-pre-wrap rounded-md bg-card-foreground/5 p-3 font-mono text-xs text-muted-foreground">{result.calibrationParameters}</p>
            </div>
            <div>
                <h4 className="font-semibold">Justification</h4>
                <p className="text-muted-foreground">{result.justification}</p>
            </div>
        </div>
    )
}
