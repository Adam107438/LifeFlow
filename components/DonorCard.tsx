import React from 'react';
import { UserProfile, DonationStatus } from '../types';
import { calculateDaysRemaining } from '../constants';
import { MapPin, Calendar, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface DonorCardProps {
  donor: UserProfile;
}

const DonorCard: React.FC<DonorCardProps> = ({ donor }) => {
  const navigate = useNavigate();
  const daysRemaining = calculateDaysRemaining(donor.lastDonatedDate);
  const isEligible = daysRemaining === 0;

  // Visual status override based on calculation
  const statusDisplay = isEligible ? DonationStatus.ELIGIBLE : DonationStatus.INELIGIBLE;
  
  return (
    <div 
      onClick={() => navigate(`/donor/${donor.uid}`)}
      className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow cursor-pointer relative overflow-hidden group"
    >
      <div className="absolute top-0 right-0 p-4">
        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
          isEligible 
            ? 'bg-green-100 text-green-700' 
            : 'bg-red-100 text-red-700'
        }`}>
          {isEligible ? 'Donate' : 'Donated'}
        </span>
      </div>

      <div className="flex items-start space-x-4">
        <div className="flex-shrink-0">
          <div className="h-16 w-16 bg-brand-50 rounded-full flex items-center justify-center text-brand-600 font-bold text-xl border-2 border-brand-100">
            {donor.bloodGroup}
          </div>
        </div>
        
        <div className="flex-1 min-w-0">
          <p className="text-lg font-bold text-gray-900 truncate group-hover:text-brand-600 transition-colors">
            {donor.name}
          </p>
          
          <div className="mt-2 space-y-1">
            <div className="flex items-center text-sm text-gray-500">
              <MapPin className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
              <span className="truncate">{donor.area}, {donor.district}</span>
            </div>
            
            <div className="flex items-center text-sm text-gray-500">
              <Calendar className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
              <span>
                {isEligible 
                  ? 'Ready to donate' 
                  : `${daysRemaining} days remaining`}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DonorCard;
