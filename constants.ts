import { BloodGroup } from './types';

export const BLOOD_GROUPS = Object.values(BloodGroup);

export const DISTRICTS = [
  "Dhaka", "Chittagong", "Sylhet", "Rajshahi", "Khulna", 
  "Barisal", "Rangpur", "Mymensingh", "Comilla", "Gazipur", 
  "Narayanganj", "Bogra", "Jessore", "Cox's Bazar"
];

export const GENDERS = ["Male", "Female", "Other"];

// Helper to calculate eligibility
export const DAYS_COOLDOWN = 90;

export const calculateDaysRemaining = (lastDonatedDate: number | null): number => {
  if (!lastDonatedDate) return 0;
  
  const lastDate = new Date(lastDonatedDate);
  const today = new Date();
  
  const diffTime = Math.abs(today.getTime() - lastDate.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
  
  const remaining = DAYS_COOLDOWN - diffDays;
  return remaining > 0 ? remaining : 0;
};
