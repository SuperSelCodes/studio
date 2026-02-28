'use server';
/**
 * @fileOverview An AI tool that suggests optimal sensor array placements and calibration parameters.
 *
 * - aiSensorConfigurationRecommendation - A function that handles the sensor configuration recommendation process.
 * - AiSensorConfigurationRecommendationInput - The input type for the aiSensorConfigurationRecommendation function.
 * - AiSensorConfigurationRecommendationOutput - The return type for the aiSensorConfigurationRecommendation function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AiSensorConfigurationRecommendationInputSchema = z.object({
  environmentType: z
    .string()
    .describe(
      'The type of environment (e.g., indoor, outdoor, urban, warehouse, factory, office, open-field).' |
        'Provide detailed characteristics if possible.'
    ),
  coverageAreaDimensions: z
    .object({
      length: z.number().describe('Length of the coverage area in meters.'),
      width: z.number().describe('Width of the coverage area in meters.'),
      height: z
        .number()
        .optional()
        .describe('Height of the coverage area in meters (optional, defaults to 3m for indoor).'),
    })
    .describe('Dimensions of the area where sensors need to provide coverage.'),
  desiredAccuracyMeters: z
    .number()
    .min(0.1)
    .max(5)
    .describe('The desired tracking accuracy in meters (e.g., 0.5 for 50cm).'),
  potentialInterferenceSources: z
    .array(z.string())
    .describe(
      'A list of potential interference sources (e.g., metal racks, moving machinery, large bodies of water, dense foliage, RF noise).' |
        'Provide "none" if not applicable.'
    ),
  existingInfrastructure: z
    .array(z.string())
    .describe(
      'A list of existing infrastructure details (e.g., power outlets available every 10m, Wi-Fi coverage, concrete walls, open-plan layout).' |
        'Provide "none" if not applicable.'
    ),
  materialComposition: z
    .string()
    .optional()
    .describe(
      'Optional: Description of primary building materials or terrain (e.g., reinforced concrete, drywall, open terrain, dense forest).'
    ),
});
export type AiSensorConfigurationRecommendationInput = z.infer<
  typeof AiSensorConfigurationRecommendationInputSchema
>;

const AiSensorConfigurationRecommendationOutputSchema = z.object({
  recommendedPlacementPlan: z
    .string()
    .describe(
      'A detailed plan describing optimal sensor placement, including descriptions for each sensor location (e.g., "Sensor 1: Top-left corner, 2m from wall, 2.5m high").'
    ),
  calibrationParameters: z
    .string()
    .describe(
      'Recommended calibration parameters for sensors (e.g., signal strength: medium, frequency band: 2.4 GHz, sensitivity: high, polling rate: 100ms).'
    ),
  expectedCoverageEfficiency: z
    .number()
    .min(0)
    .max(100)
    .describe('The expected percentage of coverage efficiency.'),
  expectedInterferenceReduction: z
    .number()
    .min(0)
    .max(100)
    .describe('The expected percentage of interference reduction.'),
  justification: z
    .string()
    .describe('An explanation and reasoning behind the recommendations.'),
});
export type AiSensorConfigurationRecommendationOutput = z.infer<
  typeof AiSensorConfigurationRecommendationOutputSchema
>;

export async function aiSensorConfigurationRecommendation(
  input: AiSensorConfigurationRecommendationInput
): Promise<AiSensorConfigurationRecommendationOutput> {
  return aiSensorConfigurationRecommendationFlow(input);
}

const prompt = ai.definePrompt({
  name: 'aiSensorConfigurationRecommendationPrompt',
  input: {schema: AiSensorConfigurationRecommendationInputSchema},
  output: {schema: AiSensorConfigurationRecommendationOutputSchema},
  prompt: `You are an expert IoT Systems Architect specializing in low-latency sensor fusion and geospatial visualization.
Your task is to suggest optimal sensor array placements and calibration parameters to minimize interference and maximize coverage efficiency,
based on the provided environmental analysis and desired accuracy.

### Input Details:
Environment Type: {{{environmentType}}}
Coverage Area Dimensions: Length={{coverageAreaDimensions.length}}m, Width={{coverageAreaDimensions.width}}m{{#if coverageAreaDimensions.height}}, Height={{coverageAreaDimensions.height}}m{{/if}}
Desired Accuracy: {{{desiredAccuracyMeters}}} meters
Potential Interference Sources: {{{potentialInterferenceSources}}}
Existing Infrastructure: {{{existingInfrastructure}}}
{{#if materialComposition}}Material Composition: {{{materialComposition}}}{{/if}}

### Instructions:
1.  **Sensor Placement Plan**: Provide a detailed, actionable plan for where each sensor should be placed within the coverage area. Consider the dimensions, environment type, and potential interference.
2.  **Calibration Parameters**: Suggest specific calibration parameters for the sensors to achieve the desired accuracy while minimizing interference.
3.  **Expected Outcomes**: Estimate the expected coverage efficiency and interference reduction percentage based on your recommendations.
4.  **Justification**: Explain the reasoning behind your recommendations, highlighting how they address the specific environment, desired accuracy, and interference challenges.

Ensure your recommendations are practical and aim for sub-200ms latency tracking.`,
});

const aiSensorConfigurationRecommendationFlow = ai.defineFlow(
  {
    name: 'aiSensorConfigurationRecommendationFlow',
    inputSchema: AiSensorConfigurationRecommendationInputSchema,
    outputSchema: AiSensorConfigurationRecommendationOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
