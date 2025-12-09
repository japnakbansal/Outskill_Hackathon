import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

interface GenerateItineraryRequest {
  userId: string;
  workflowType: 'plan' | 'surprise';
  destination: string;
  duration: number;
  budget: number;
  experiences?: string[];
}

interface Activity {
  time: string;
  title: string;
  description: string;
}

interface DayItinerary {
  dayNumber: number;
  theme: string;
  activitiesSummary: string;
  localStory: string;
  planB: string;
  imageUrl?: string;
  activities: Activity[];
}

interface ItineraryResponse {
  destination: string;
  duration: number;
  workflowType: 'plan' | 'surprise';
  days: DayItinerary[];
  headerImageUrl?: string;
}

function generateSystemPrompt(workflowType: string, experiences?: string[]): string {
  const basePrompt = `You are an expert travel itinerary planner. Create a detailed, engaging travel itinerary.`;
  
  if (workflowType === 'plan' && experiences?.length) {
    return `${basePrompt} Focus on these experiences: ${experiences.join(', ')}.`;
  }
  
  return `${basePrompt} Make it spontaneous and fun with varied activities.`;
}

function generateUserPrompt(destination: string, duration: number, budget: number, workflowType: string): string {
  return `Create a ${duration}-day itinerary for ${destination} with a daily budget of $${budget}.
  
For each day, provide:
1. A theme for the day
2. Activities summary with specific activities and approximate times
3. A local story or interesting fact about the destination
4. A backup plan (Plan B) for bad weather or unavailability

Format your response as valid JSON with this exact structure:
{
  "days": [
    {
      "dayNumber": 1,
      "theme": "Theme name",
      "activitiesSummary": "Morning: Activity 1 (9am-12pm)\\nAfternoon: Activity 2 (1pm-5pm)\\nEvening: Activity 3 (7pm-10pm)",
      "localStory": "Interesting fact or story about this location",
      "planB": "Alternative activities for bad weather"
    }
  ]
}

Make it specific to ${destination}, culturally sensitive, and within the budget. Include realistic timings and actual attractions.`;
}

async function fetchImageUrl(searchQuery: string): Promise<string> {
  try {
    const response = await fetch(
      `https://api.unsplash.com/search/photos?query=${encodeURIComponent(searchQuery)}&per_page=1&client_id=${Deno.env.get('UNSPLASH_ACCESS_KEY') || ''}`,
      { method: 'GET' }
    );
    
    if (!response.ok) return '';
    const data = await response.json();
    return data.results?.[0]?.urls?.regular || '';
  } catch {
    return '';
  }
}

async function generateItineraryWithAI(
  destination: string,
  duration: number,
  budget: number,
  workflowType: string,
  experiences?: string[]
): Promise<DayItinerary[]> {
  const openaiKey = Deno.env.get('OPENAI_API_KEY');
  
  if (!openaiKey) {
    throw new Error('OpenAI API key not configured');
  }

  const systemPrompt = generateSystemPrompt(workflowType, experiences);
  const userPrompt = generateUserPrompt(destination, duration, budget, workflowType);

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${openaiKey}`,
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: systemPrompt,
        },
        {
          role: 'user',
          content: userPrompt,
        },
      ],
      temperature: 0.7,
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(`OpenAI API error: ${error.error?.message || 'Unknown error'}`);
  }

  const data = await response.json();
  const content = data.choices[0]?.message?.content;
  
  if (!content) {
    throw new Error('No response from AI');
  }

  const parsed = JSON.parse(content);
  return parsed.days || [];
}

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const payload: GenerateItineraryRequest = await req.json();

    const days = await generateItineraryWithAI(
      payload.destination,
      payload.duration,
      payload.budget,
      payload.workflowType,
      payload.experiences
    );

    const headerImageUrl = await fetchImageUrl(payload.destination);

    const itinerary: ItineraryResponse = {
      destination: payload.destination,
      duration: payload.duration,
      workflowType: payload.workflowType,
      days,
      headerImageUrl,
    };

    return new Response(JSON.stringify(itinerary), {
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error('Error:', error);
    return new Response(
      JSON.stringify({
        error: error instanceof Error ? error.message : 'Internal server error',
      }),
      {
        status: 500,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      }
    );
  }
});
