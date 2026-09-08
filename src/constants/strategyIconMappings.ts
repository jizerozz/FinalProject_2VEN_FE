// Verified against api.tradely.online/api/strategies/registration-form on 2026-09-08.
// List responses contain only these image URLs; resolve them locally without requesting S3.
export const strategyIconFileLabels = {
  '92d70f53-1d29-4704-a21c-6d8be8f85bc0.png': '자동',
  'd3bd6274-2be5-4efe-8ec1-6736979821e6.png': '하이브리드',
  '701a31eb-5c79-4d9d-b1f2-a3ed2e18d179.png': '수동',
  '1ec1159d-4494-450f-ae75-43f4e3674e98.png': '데이',
  '46ba0897-bc11-495d-bffc-0af048073d83.png': '포지션',
} as const;
