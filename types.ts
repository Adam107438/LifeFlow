export enum BloodGroup {
  A_POS = 'A+',
  A_NEG = 'A-',
  B_POS = 'B+',
  B_NEG = 'B-',
  AB_POS = 'AB+',
  AB_NEG = 'AB-',
  O_POS = 'O+',
  O_NEG = 'O-',
}

export enum DonationStatus {
  ELIGIBLE = 'Donate',
  INELIGIBLE = 'Donated',
}

export interface UserProfile {
  uid: string;
  name: string;
  email: string;
  phone: string;
  age: number;
  gender: 'Male' | 'Female' | 'Other';
  district: string;
  area: string;
  bloodGroup: BloodGroup;
  lastDonatedDate: number | null; // Timestamp in milliseconds
  status: DonationStatus;
  createdAt: number;
}

// For form inputs
export interface ProfileFormData {
  name: string;
  phone: string;
  age: string;
  gender: string;
  district: string;
  area: string;
  bloodGroup: string;
}
