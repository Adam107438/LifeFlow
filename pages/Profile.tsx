import React, { useState, useEffect } from 'react';
import { auth } from '../lib/firebase';
import { getUserProfile, updateUserProfile, recordDonation } from '../services/dataService';
import { UserProfile, BloodGroup, DonationStatus } from '../types';
import { DISTRICTS, BLOOD_GROUPS, GENDERS, calculateDaysRemaining } from '../constants';
import { Save, Heart, AlertTriangle } from 'lucide-react';

const Profile: React.FC = () => {
  const [profile, setProfile] = useState<Partial<UserProfile>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const user = auth.currentUser;

  // Mock User ID for demo if not logged in (would be handled by AuthGuard in App.tsx)
  const uid = user?.uid || '1'; 

  useEffect(() => {
    if (uid) {
      loadProfile();
    }
  }, [uid]);

  const loadProfile = async () => {
    try {
      const data = await getUserProfile(uid);
      if (data) {
        setProfile(data);
      } else {
        // Initialize with Auth defaults
        setProfile({
          uid: uid,
          email: user?.email || '',
          status: DonationStatus.ELIGIBLE
        });
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      // Basic validation
      if (!profile.name || !profile.bloodGroup || !profile.district) {
        alert("Please fill in required fields.");
        setSaving(false);
        return;
      }
      
      const payload: Partial<UserProfile> = {
        ...profile,
        age: Number(profile.age),
        uid: uid,
        updatedAt: Date.now()
      } as any;

      await updateUserProfile(uid, payload);
      alert('Profile updated successfully!');
    } catch (error) {
      console.error(error);
      alert('Failed to save profile.');
    } finally {
      setSaving(false);
    }
  };

  const handleDonateNow = async () => {
    if (window.confirm("Are you sure you want to record a donation today? This will mark you as ineligible for 90 days.")) {
      try {
        await recordDonation(uid);
        await loadProfile(); // Reload to see changes
      } catch (error) {
        alert("Failed to record donation.");
      }
    }
  };

  const daysRemaining = calculateDaysRemaining(profile.lastDonatedDate || null);
  const isEligible = daysRemaining === 0;

  if (loading) return <div className="p-8 text-center">Loading Profile...</div>;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      
      {/* Status Card */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mb-8">
        <div className="p-6 md:p-8 flex flex-col md:flex-row items-center justify-between bg-gradient-to-r from-brand-50 to-white">
          <div className="mb-4 md:mb-0">
            <h2 className="text-2xl font-bold text-gray-900">Donation Status</h2>
            <p className="text-gray-600 mt-1">
              {isEligible 
                ? "You are currently eligible to donate blood." 
                : `You can donate again in ${daysRemaining} days.`}
            </p>
          </div>
          
          {isEligible ? (
            <button
              onClick={handleDonateNow}
              className="flex items-center px-6 py-3 bg-brand-600 text-white rounded-full font-bold shadow-lg hover:bg-brand-700 transform hover:scale-105 transition-all"
            >
              <Heart className="w-5 h-5 mr-2 fill-current" />
              Donate Now
            </button>
          ) : (
            <div className="flex items-center px-6 py-3 bg-gray-100 text-gray-500 rounded-full font-bold cursor-not-allowed">
              <Heart className="w-5 h-5 mr-2" />
              Donated
            </div>
          )}
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-100">
          <h3 className="text-lg font-medium text-gray-900">Personal Information</h3>
          <p className="text-sm text-gray-500">Update your contact information and blood group.</p>
        </div>
        
        <form onSubmit={handleSave} className="p-6 space-y-6">
          <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
            
            <div className="sm:col-span-3">
              <label className="block text-sm font-medium text-gray-700">Full Name</label>
              <input
                type="text"
                name="name"
                value={profile.name || ''}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-brand-500 focus:border-brand-500 sm:text-sm"
              />
            </div>

            <div className="sm:col-span-3">
              <label className="block text-sm font-medium text-gray-700">Phone Number</label>
              <input
                type="text"
                name="phone"
                value={profile.phone || ''}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-brand-500 focus:border-brand-500 sm:text-sm"
              />
            </div>

            <div className="sm:col-span-3">
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <input
                type="email"
                name="email"
                disabled
                value={profile.email || ''}
                className="mt-1 block w-full bg-gray-50 border border-gray-300 rounded-md shadow-sm py-2 px-3 text-gray-500 sm:text-sm"
              />
            </div>

            <div className="sm:col-span-3">
              <label className="block text-sm font-medium text-gray-700">Blood Group</label>
              <select
                name="bloodGroup"
                value={profile.bloodGroup || ''}
                onChange={handleChange}
                className="mt-1 block w-full bg-white border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-brand-500 focus:border-brand-500 sm:text-sm"
              >
                <option value="">Select Group</option>
                {BLOOD_GROUPS.map(bg => <option key={bg} value={bg}>{bg}</option>)}
              </select>
            </div>

            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-700">Age</label>
              <input
                type="number"
                name="age"
                value={profile.age || ''}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-brand-500 focus:border-brand-500 sm:text-sm"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-700">Gender</label>
              <select
                name="gender"
                value={profile.gender || ''}
                onChange={handleChange}
                className="mt-1 block w-full bg-white border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-brand-500 focus:border-brand-500 sm:text-sm"
              >
                <option value="">Select</option>
                {GENDERS.map(g => <option key={g} value={g}>{g}</option>)}
              </select>
            </div>

            <div className="sm:col-span-3">
              <label className="block text-sm font-medium text-gray-700">District</label>
              <select
                name="district"
                value={profile.district || ''}
                onChange={handleChange}
                className="mt-1 block w-full bg-white border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-brand-500 focus:border-brand-500 sm:text-sm"
              >
                <option value="">Select District</option>
                {DISTRICTS.map(d => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>

            <div className="sm:col-span-3">
              <label className="block text-sm font-medium text-gray-700">Area / Upazila</label>
              <input
                type="text"
                name="area"
                value={profile.area || ''}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-brand-500 focus:border-brand-500 sm:text-sm"
              />
            </div>
          </div>

          <div className="pt-5 border-t border-gray-100 flex justify-end">
             <button
              type="submit"
              disabled={saving}
              className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-brand-600 hover:bg-brand-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-500 disabled:opacity-50"
            >
              {saving ? 'Saving...' : 'Save Profile'}
              <Save className="ml-2 h-4 w-4" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Profile;
