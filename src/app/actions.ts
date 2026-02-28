'use server';

import {
  aiSensorConfigurationRecommendation,
  type AiSensorConfigurationRecommendationInput,
  type AiSensorConfigurationRecommendationOutput,
} from '@/ai/flows/ai-sensor-configuration-recommendation';
import { z } from 'zod';

const AiSensorConfigurationRecommendationInputSchema = z.object({
  environmentType: z.string(),
  coverageAreaDimensions: z.object({
      length: z.number(),
      width: z.number(),
      height: z.number().optional(),
    }),
  desiredAccuracyMeters: z.number(),
  potentialInterferenceSources: z.array(z.string()),
  existingInfrastructure: z.array(z.string()),
});

export async function getAISensorRecommendation(
  input: AiSensorConfigurationRecommendationInput
): Promise<AiSensorConfigurationRecommendationOutput | { error: string }> {
  try {
    const validatedInput = AiSensorConfigurationRecommendationInputSchema.parse(input);
    const result = await aiSensorConfigurationRecommendation(validatedInput);
    return result;
  } catch (e) {
    console.error(e);
    if (e instanceof z.ZodError) {
      return { error: `Invalid input: ${e.errors.map(err => err.message).join(', ')}` };
    }
    return { error: 'Failed to get recommendation. Please check the inputs and try again.' };
  }
}
