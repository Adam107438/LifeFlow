import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getUserProfile } from '../services/dataService';
import { UserProfile } from '../types';
import { calculateDaysRemaining } from '../constants';
import { Phone, MessageCircle, ArrowLeft, MapPin, User, Shield } from 'lucide-react';

const DonorDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [donor, setDonor] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      getUserProfile(id).then(setDonor).finally(() => setLoading(false));
    }
  }, [id]);

  if (loading) return <div className="p-8 text-center">Loading donor details...</div>;
  if (!donor) return <div className="p-8 text-center">Donor not found.</div>;

  const daysRemaining = calculateDaysRemaining(donor.lastDonatedDate);
  const isEligible = daysRemaining === 0;

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <button 
        onClick={() => navigate(-1)}
        className="mb-6 flex items-center text-gray-600 hover:text-brand-600 transition-colors"
      >
        <ArrowLeft className="h-4 w-4 mr-1" />
        Back to Search
      </button>

      <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className="bg-brand-600 px-6 py-8 text-center relative">
          <div className="inline-block p-1 bg-white rounded-full mb-4">
             <div className="h-24 w-24 bg-brand-50 rounded-full flex items-center justify-center text-brand-600 font-bold text-3xl">
                {donor.bloodGroup}
             </div>
          </div>
          <h1 className="text-2xl font-bold text-white">{donor.name}</h1>
          <p className="text-brand-100 flex items-center justify-center mt-1">
            <MapPin className="h-4 w-4 mr-1" />
            {donor.area}, {donor.district}
          </p>
        </div>

        <div className="p-6">
          {/* Status Badge */}
          <div className="flex justify-center mb-8">
            <span className={`px-4 py-2 rounded-full font-semibold flex items-center ${
               isEligible ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
            }`}>
              <Shield className="h-4 w-4 mr-2" />
              {isEligible ? 'Eligible to Donate' : `Not Eligible (${daysRemaining} days left)`}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-8 text-center">
            <div className="p-4 bg-gray-50 rounded-lg">
               <span className="block text-xs text-gray-500 uppercase tracking-wide">Age</span>
               <span className="block text-lg font-medium text-gray-900">{donor.age} Years</span>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
               <span className="block text-xs text-gray-500 uppercase tracking-wide">Gender</span>
               <span className="block text-lg font-medium text-gray-900">{donor.gender}</span>
            </div>
          </div>

          <div className="space-y-4">
            <a 
              href={`tel:${donor.phone}`}
              className="w-full flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-brand-600 hover:bg-brand-700 md:text-lg transition-colors"
            >
              <Phone className="h-5 w-5 mr-3" />
              Call Now
            </a>
            
            <a 
              href={`https://wa.me/${donor.phone.replace(/[^0-9]/g, '')}`}
              target="_blank"
              rel="noreferrer"
              className="w-full flex items-center justify-center px-6 py-3 border border-gray-300 text-base font-medium rounded-md text-gray-700 bg-white hover:bg-green-50 md:text-lg transition-colors"
            >
              <MessageCircle className="h-5 w-5 mr-3 text-green-600" />
              Message on WhatsApp
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DonorDetails;
