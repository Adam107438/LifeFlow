import { db, isConfigured } from '../lib/firebase';
import { doc, getDoc, setDoc, updateDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { UserProfile, DonationStatus, BloodGroup } from '../types';

// Mock data for demonstration if Firebase is not configured
const MOCK_USERS: UserProfile[] = [
  {
    uid: '1',
    name: 'Rahim Ahmed',
    email: 'rahim@example.com',
    phone: '+8801711223344',
    age: 28,
    gender: 'Male',
    district: 'Dhaka',
    area: 'Dhanmondi',
    bloodGroup: BloodGroup.O_POS,
    lastDonatedDate: Date.now() - (100 * 24 * 60 * 60 * 1000), // 100 days ago
    status: DonationStatus.ELIGIBLE,
    createdAt: Date.now()
  },
  {
    uid: '2',
    name: 'Fatima Begum',
    email: 'fatima@example.com',
    phone: '+8801911223344',
    age: 24,
    gender: 'Female',
    district: 'Chittagong',
    area: 'Nasirabad',
    bloodGroup: BloodGroup.A_POS,
    lastDonatedDate: Date.now() - (10 * 24 * 60 * 60 * 1000), // 10 days ago
    status: DonationStatus.INELIGIBLE,
    createdAt: Date.now()
  },
  {
    uid: '3',
    name: 'Karim Uddin',
    email: 'karim@example.com',
    phone: '+8801811223344',
    age: 32,
    gender: 'Male',
    district: 'Dhaka',
    area: 'Gulshan',
    bloodGroup: BloodGroup.O_POS,
    lastDonatedDate: null,
    status: DonationStatus.ELIGIBLE,
    createdAt: Date.now()
  }
];

export const getUserProfile = async (uid: string): Promise<UserProfile | null> => {
  if (!isConfigured) {
    const mock = MOCK_USERS.find(u => u.uid === uid);
    return mock || null;
  }
  
  try {
    const docRef = doc(db, 'users', uid);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return docSnap.data() as UserProfile;
    }
    return null;
  } catch (error) {
    console.error("Error fetching user profile:", error);
    throw error;
  }
};

export const updateUserProfile = async (uid: string, data: Partial<UserProfile>) => {
  if (!isConfigured) {
    console.log('Mock Update:', data);
    return;
  }
  const userRef = doc(db, 'users', uid);
  await setDoc(userRef, data, { merge: true });
};

export const searchDonors = async (district?: string, bloodGroup?: string): Promise<UserProfile[]> => {
  if (!isConfigured) {
    return MOCK_USERS.filter(user => {
      const matchDistrict = district ? user.district === district : true;
      const matchBlood = bloodGroup ? user.bloodGroup === bloodGroup : true;
      return matchDistrict && matchBlood;
    });
  }

  try {
    const usersRef = collection(db, 'users');
    let q = query(usersRef);

    if (district) {
      q = query(q, where('district', '==', district));
    }
    if (bloodGroup) {
      q = query(q, where('bloodGroup', '==', bloodGroup));
    }

    const querySnapshot = await getDocs(q);
    const users: UserProfile[] = [];
    querySnapshot.forEach((doc) => {
      users.push(doc.data() as UserProfile);
    });
    return users;
  } catch (error) {
    console.error("Error searching donors:", error);
    return [];
  }
};

export const recordDonation = async (uid: string) => {
  const timestamp = Date.now();
  await updateUserProfile(uid, {
    lastDonatedDate: timestamp,
    status: DonationStatus.INELIGIBLE
  });
};
