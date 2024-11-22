"use client"

import { useGetPaymentDataQuery, useUpdateUserMutation } from '@/store/storeApi';
import React, { useState, useRef, useEffect } from 'react';

const ViewDashboard = () => {
  const [availableGrids, setAvailableGrids] = useState(95000);
  const [pricePerGrid, setPricePerGrid] = useState(0.5);
  const [walletName, setWalletName] = useState('');
  const [walletAddress, setWalletAddress] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('All Status');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [tokenName, setTokenName] = useState('');
  const [tokenIcon, setTokenIcon] = useState(null);
  const totalGrids = 100000;
const {isLoading,isError,data,isSuccess} = useGetPaymentDataQuery()
const [updateStatus,{isLoading:updateLoading,isError:updateError,isSuccess:updateSuccess}] = useUpdateUserMutation()
  const statusOptions = ['All Status', 'Approve', 'Pending', 'Reject'];
  const [filter, setFilter] = useState([]);

const [paymentData,setPaymentData] = useState([])
  const calculateAvailablePercentage = () => {
    return ((availableGrids / totalGrids) * 100).toFixed(1);
  };

  const handleTokenIconUpload = (event:any) => {
    const file = event.target.files[0];
    if (file) {
      setTokenIcon(URL.createObjectURL(file));
    }
  };

  const dropdownRef = useRef(null);
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);


  const getStatusColor = (status) => {
    switch (status) {
      case 'Approve':
        return 'bg-green-500';
      case 'pending':
        return 'bg-yellow-500';
      case 'Reject':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };
console.log(searchQuery,'search')
  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Super Admin Dashboard</h1>
        <div className="space-x-2">
          <button className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600">
            Sync Data
          </button>
          <button className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
            Settings
          </button>
        </div>
      </div>

      {/* Grid Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="bg-gray-800 rounded-lg p-6">
          <h2 className="text-lg mb-2">Total Grids</h2>
          <div className="text-4xl font-bold">100,000</div>
          <div className="text-sm text-gray-400">System Capacity</div>
        </div>

        <div className="bg-gray-800 rounded-lg p-6">
          <h2 className="text-lg mb-2">Available Grids</h2>
          <div className="flex items-center gap-2 mb-2">
            <input
              type="number"
              value={availableGrids}
              onChange={(e) => setAvailableGrids(Number(e.target.value))}
              className="bg-gray-700 text-white px-3 py-2 rounded w-32"
            />
            <button className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600">
              Update
            </button>
          </div>
          <div className="text-sm text-gray-400">
            {calculateAvailablePercentage()}% Available
          </div>
        </div>
      </div>

      {/* Token Settings */}
      <div className="bg-gray-800 rounded-lg p-6 mb-6">
        <h2 className="text-lg mb-4">Token Settings</h2>
        
        <div className="space-y-4">
          <div>
            <div className="text-sm mb-2">Token Name</div>
            <div className="flex items-center gap-2">
              <input
                value={tokenName}
                onChange={(e) => setTokenName(e.target.value)}
                placeholder="Enter token name"
                className="bg-gray-700 text-white px-3 py-2 rounded flex-grow"
              />
              <button className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600">
                Update
              </button>
            </div>
          </div>

          <div>
            <div className="text-sm mb-2">Token Icon</div>
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-gray-700 rounded-lg overflow-hidden">
                {tokenIcon ? (
                  <img src={tokenIcon} alt="Token Icon" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                    🪙
                  </div>
                )}
              </div>
              <div className="flex-grow">
                <label className="cursor-pointer">
                  <div className="flex items-center gap-2 px-4 py-2 bg-gray-700 text-white rounded hover:bg-gray-600 w-fit">
                    <span>📤</span>
                    Upload Token Icon
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleTokenIconUpload}
                    className="hidden"
                  />
                </label>
                <div className="text-sm text-gray-400 mt-1">
                  Recommended size: 128x128px
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Price & Payment Settings */}
      <div className="bg-gray-800 rounded-lg p-6 mb-6">
        <h2 className="text-lg mb-4">Price & Payment Settings</h2>
        
        <div className="space-y-4">
          <div>
            <div className="text-sm mb-2">Price Per Grid</div>
            <div className="flex items-center gap-2">
              <input
                type="number"
                value={pricePerGrid}
                onChange={(e) => setPricePerGrid(Number(e.target.value))}
                className="bg-gray-700 text-white px-3 py-2 rounded w-32"
              />
              <span className="px-3 py-2 bg-gray-700 rounded">USD</span>
              <button className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600">
                Update
              </button>
            </div>
          </div>

          <div>
            <div className="text-sm mb-2">Wallet Name</div>
            <div className="flex items-center gap-2">
              <input
                value={walletName}
                onChange={(e) => setWalletName(e.target.value)}
                placeholder="Enter wallet name"
                className="bg-gray-700 text-white px-3 py-2 rounded flex-grow"
              />
              <button className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600">
                Update
              </button>
            </div>
          </div>

          <div>
            <div className="text-sm mb-2">Wallet Address</div>
            <div className="flex items-center gap-2">
              <input
                value={walletAddress}
                onChange={(e) => setWalletAddress(e.target.value)}
                placeholder="Enter wallet address"
                className="bg-gray-700 text-white px-3 py-2 rounded flex-grow"
              />
              <button className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600">
                Update
              </button>
              <button className="p-2 text-gray-400 hover:text-white">
                📋
              </button>
            </div>
          </div>

          <div>
            <div className="text-sm mb-2">Wallet QR Code</div>
            <div className="flex items-center justify-center h-40 bg-gray-700 rounded-lg">
              <button className="flex items-center gap-2 text-gray-400 hover:text-white">
                <span>📤</span>
                Upload QR Code
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Pending Approvals */}
      <div className="bg-gray-800 rounded-lg p-6">
        <h2 className="text-lg mb-4">Pending Approvals</h2>
        
        <div className="flex items-center gap-2 mb-4">
          <input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by username or wallet address..."
            className="bg-gray-700 text-white px-3 py-2 rounded flex-grow"
          />
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center justify-between w-40 px-4 py-2 bg-gray-700 text-white rounded hover:bg-gray-600"
            >
              <span>{selectedStatus}</span>
              <span className="ml-2">▼</span>
            </button>
            
            {isDropdownOpen && (
  <div className="absolute z-10 mt-1 w-40 bg-gray-700 rounded-lg shadow-lg">
    {statusOptions.map((status) => (
      <button
        key={status}

        onClick={() => {
          setSelectedStatus(status); // Update the selected status
          const filterData = data?.payments?.filter((payment: any) => {
            return payment.status === status; // Use the status directly here
          });
          console.log(filterData, 'Filtered Data');
          setFilter(filterData)
          setIsDropdownOpen(false);
        }}
        className="w-full px-4 py-2 text-left hover:bg-gray-600 first:rounded-t-lg last:rounded-b-lg"
      >
        {status}
      </button>
    ))}
  </div>
)}

          </div>
        </div>

        <div className="space-y-4">
  {(filter?.length > 0 ? filter : data?.payments)?.map((approval, index) => {
    const date = new Date(approval.created_at).toLocaleDateString();
    return (
      <div key={index} className="bg-gray-700 rounded-lg p-4">
        <div className="flex justify-between items-start mb-2">
          <div>
            <div className="flex items-center gap-2">
              <span>{approval.username}</span>
              <span className={`px-2 py-1 text-xs ${getStatusColor(approval.status)} rounded`}>
                {approval.status}
              </span>
            </div>
            <div className="text-sm text-gray-400">{date}</div>
          </div>
          <div className="text-right">
            <div>{approval.grid} Grids</div>
            <div className="text-green-500">${approval.amount}</div>
          </div>
        </div>

        <div className="flex items-center gap-2 text-sm bg-gray-800 rounded p-2">
          <span>{approval.wallet_address}</span>
          <span>({approval.currency})</span>
          <button className="p-1 text-gray-400 hover:text-white">📋</button>
        </div>

        <div className="flex justify-end gap-2 mt-2">
          <button
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
            onClick={() => {
              updateStatus({ status: 'Reject', email: approval.user_email });
            }}
          >
            Reject
          </button>
          <button
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
            onClick={() => {
              updateStatus({ status: 'Approve', email: approval.user_email });
            }}
          >
            Approve
          </button>
        </div>
      </div>
    );
  })}
</div>

      </div>
    </div>
  );
};

export default ViewDashboard;
