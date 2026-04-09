import type { Fund, FundDetail } from '@/src/types/fund';

const BASE_URL = 'https://api.mfapi.in/mf';

export async function fetchAllFunds(): Promise<Fund[]> {
  const response = await fetch(BASE_URL);
  if (!response.ok) {
    throw new Error('Failed to fetch funds');
  }
  return response.json();
}

export async function fetchFundDetail(schemeCode: number): Promise<FundDetail> {
  const response = await fetch(`${BASE_URL}/${schemeCode}`);
  if (!response.ok) {
    throw new Error('Failed to fetch fund details');
  }
  return response.json();
}

export async function searchFunds(query: string): Promise<Fund[]> {
  const response = await fetch(`${BASE_URL}/search?q=${encodeURIComponent(query)}`);
  if (!response.ok) {
    throw new Error('Failed to search funds');
  }
  return response.json();
}
