'use client';

import { useState } from 'react';
import type { SubmitHandler } from 'react-hook-form';
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Sparkles } from 'lucide-react';
import { getAISensorRecommendation } from '@/app/actions';
import type { AiSensorConfigurationRecommendationOutput } from '@/ai/flows/ai-sensor-configuration-recommendation';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { AiConfiguratorForm, type AiConfiguratorFormValues } from './ai-configurator-form';

export function AiConfigurator() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<AiSensorConfigurationRecommendationOutput | null>(null);

  const onSubmit: SubmitHandler<AiConfiguratorFormValues> = async (data) => {
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
        <Accordion type="single" collapsible defaultValue="ai-configurator">
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
                        <AiConfiguratorForm isLoading={isLoading} onSubmit={onSubmit} />
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
