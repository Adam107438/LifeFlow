import React, { useState, useEffect } from 'react';
import { UserProfile } from '../types';
import { searchDonors } from '../services/dataService';
import { DISTRICTS, BLOOD_GROUPS } from '../constants';
import DonorCard from '../components/DonorCard';
import { Search, Filter } from 'lucide-react';

const Dashboard: React.FC = () => {
  const [donors, setDonors] = useState<UserProfile[]>([]);
  const [district, setDistrict] = useState('');
  const [bloodGroup, setBloodGroup] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    setLoading(true);
    const results = await searchDonors(
      district || undefined, 
      bloodGroup || undefined
    );
    setDonors(results);
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, [district, bloodGroup]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="md:flex md:items-center md:justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Find Donors</h1>
          <p className="mt-1 text-sm text-gray-500">
            Search for blood donors in your area immediately.
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <label className="block text-xs font-medium text-gray-700 mb-1">District</label>
            <select
              value={district}
              onChange={(e) => setDistrict(e.target.value)}
              className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-brand-500 focus:border-brand-500 sm:text-sm rounded-md border"
            >
              <option value="">All Districts</option>
              {DISTRICTS.map(d => <option key={d} value={d}>{d}</option>)}
            </select>
          </div>

          <div className="relative">
            <label className="block text-xs font-medium text-gray-700 mb-1">Blood Group</label>
            <select
              value={bloodGroup}
              onChange={(e) => setBloodGroup(e.target.value)}
              className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-brand-500 focus:border-brand-500 sm:text-sm rounded-md border"
            >
              <option value="">All Blood Groups</option>
              {BLOOD_GROUPS.map(bg => <option key={bg} value={bg}>{bg}</option>)}
            </select>
          </div>

          <div className="flex items-end">
            <button
              onClick={fetchData}
              className="w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-brand-600 hover:bg-brand-700 focus:outline-none"
            >
              <Search className="h-4 w-4 mr-2" />
              Search
            </button>
          </div>
        </div>
      </div>

      {/* Results */}
      {loading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-600 mx-auto"></div>
          <p className="mt-4 text-gray-500">Loading donors...</p>
        </div>
      ) : donors.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {donors.map((donor) => (
            <DonorCard key={donor.uid} donor={donor} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-white rounded-lg border border-dashed border-gray-300">
          <Filter className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No donors found</h3>
          <p className="mt-1 text-sm text-gray-500">Try adjusting your search filters.</p>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
