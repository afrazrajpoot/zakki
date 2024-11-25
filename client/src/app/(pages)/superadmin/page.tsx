"use client";

import {
  useAddPriceMutation,
  useAddSpotMutation,
  useAddTokenMutation,
  useGetPaymentDataQuery,
  useGetPriceQuery,
  useGetSpotQuery,
  useUpdateUserMutation,
} from "@/store/storeApi";
import React, { useState, useRef, useEffect } from "react";
import toast from "react-hot-toast";

const ViewDashboard = () => {
  const {
    isLoading: getPriceLoading,
    isError: getPriceError,
    data: getPriceData,
    isSuccess: getPriceSucess,
  } = useGetPriceQuery();
  const [availableGrids, setAvailableGrids] = useState(null);
  const [gridPrice, setGridPrice] = useState(0);
  const [pricePerGrid, setPricePerGrid] = useState<number>(0);
  const [walletName, setWalletName] = useState("");
  const [walletAddress, setWalletAddress] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("All Status");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [tokenName, setTokenName] = useState("");
  const [tokenIcon, setTokenIcon] = useState(null);
  const [tokenImage, setTokenImage] = useState(null);
  const [qrImage, setQrImage] = useState(null);
  const [walletQr, setWalletQr] = useState<any>(null);
  const totalGrids = 100000;
  const { isLoading, isError, data, isSuccess } = useGetPaymentDataQuery();
  const [
    addSpot,
    {
      isLoading: addSpotLoading,
      isError: addSpotError,
      isSuccess: addSpotSuccess,
    },
  ] = useAddSpotMutation();
  const [
    addPrice,
    {
      isLoading: addPriceLoading,
      isError: addPriceError,
      isSuccess: addPriceSuccess,
    },
  ] = useAddPriceMutation();
  const [
    addToken,
    {
      isLoading: addTokenLoading,
      isError: addTokenError,
      isSuccess: addTokenSuccess,
    },
  ] = useAddTokenMutation();
  const [
    updateStatus,
    {
      isLoading: updateLoading,
      isError: updateError,
      isSuccess: updateSuccess,
    },
  ] = useUpdateUserMutation();
  const { data: spotData } = useGetSpotQuery();

  const statusOptions = ["All Status", "Approve", "Pending", "Reject"];
  const [filter, setFilter] = useState([]);
  const [buttonStates, setButtonStates] = useState({}); // Track state per item

  const [paymentData, setPaymentData] = useState([]);
  const calculateAvailablePercentage = () => {
    return ((availableGrids / totalGrids) * 100).toFixed(1);
  };

  const handleTokenIconUpload = (event: any) => {
    const file = event.target.files[0];
    setTokenImage(file);
    if (file) {
      setTokenIcon(URL.createObjectURL(file));
    }
  };

  const handleAddSpot = () => {
    addSpot({ totalSpot: availableGrids });
  };
  const handleWalletQr = (event: any) => {
    const file = event.target.files[0];
    setWalletQr(file);
    if (file) {
      setQrImage(URL.createObjectURL(file));
    }
  };
  const dropdownRef = useRef(null);
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleAddToken = () => {
    const formData = new FormData();
    formData.append("token_name", tokenName);
    formData.append("tokenIcon", tokenImage);
    addToken(formData);
  };
  const handlePrice = () => {
    const formData = new FormData();
    formData.append("id", 1);
    formData.append("price_per_grid", pricePerGrid);
    formData.append("wallet_name", walletName);
    formData.append("wallet_address", walletAddress);
    formData.append("walletQrCode", walletQr);
    addPrice(formData);
  };
  const getStatusColor = (status: any) => {
    switch (status) {
      case "Approve":
        return "bg-green-500";
      case "pending":
        return "bg-yellow-500";
      case "Reject":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };
  // console.log(searchQuery,'search')
  useEffect(() => {
    if (getPriceSucess) {
      setPricePerGrid(getPriceData?.data[0].price_per_grid);
      setWalletAddress(getPriceData?.data[0].wallet_address);
      setWalletName(getPriceData?.data[0].wallet_name);
    }
  }, [getPriceSucess]);
  useEffect(() => {
    const initialState = {};
    const approvals = filter?.length > 0 ? filter : data?.payments;

    approvals?.forEach((approval:any, index:any) => {
      initialState[index] = {
        approveDisabled: approval.status === "Approve",
        rejectDisabled: approval.status === "Reject",
      };
    });
    setButtonStates(initialState);
  }, [data, filter]);

  const toggleButtonState = (index, type) => {
    setButtonStates((prev) => ({
      ...prev,
      [index]: {
        approveDisabled:
          type === "approve" ? true : prev[index].approveDisabled,
        rejectDisabled: type === "reject" ? true : prev[index].rejectDisabled,
      },
    }));
  };
  useEffect(() => {
    if (addTokenSuccess) {
      toast.success("Token Added Successfully", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      setTokenName("");
      setTokenImage(null);
      setQrImage(null);
    }
  }, [addTokenSuccess]);

  useEffect(() => {
    if (addSpotSuccess) {
      toast.success("Grid Added Successfully", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    }
  }, [addSpotSuccess]);

  useEffect(() => {
    if (addPriceSuccess) {
      toast.success("Updated Successfully", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    }
  }, [addPriceSuccess]);
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
          <div className="text-4xl font-bold">
            {spotData?.data[0]?.totalSpot}
          </div>
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
            <button
              className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
              onClick={handleAddSpot}
            >
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
              <button
                className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                onClick={handleAddToken}
              >
                Add
              </button>
            </div>
          </div>

          <div>
            <div className="text-sm mb-2">Token Icon</div>
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-gray-700 rounded-lg overflow-hidden">
                {tokenIcon ? (
                  <img
                    src={tokenIcon}
                    alt="Token Icon"
                    className="w-full h-full object-cover"
                  />
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
                onChange={(e) => setPricePerGrid(e.target.value)}
                className="bg-gray-700 text-white px-3 py-2 rounded w-32"
              />
              <span className="px-3 py-2 bg-gray-700 rounded">USD</span>
              <button
                className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                onClick={handlePrice}
              >
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
              <button
                className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                onClick={handlePrice}
              >
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
              <button
                className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                onClick={handlePrice}
              >
                Update
              </button>
              <button className="p-2 text-gray-400 hover:text-white">📋</button>
            </div>
          </div>
          {
            <figure className="w-full max-w-[30vw]">
              <img
                src={
                  qrImage ||
                  `http://localhost:8081/${
                    getPriceData?.data[0].walletQrCode.split("/")[1]
                  }`
                }
                alt="qr"
                className="w-full"
              />
            </figure>
          }

          <div className="flex-grow">
            <label className="cursor-pointer">
              <div className="flex items-center gap-2 px-4 py-2 bg-gray-700 text-white rounded hover:bg-gray-600 w-fit">
                <span>📤</span>
                Upload Token Icon
              </div>
              <input
                type="file"
                accept="image/*"
                onChange={handleWalletQr}
                className="hidden"
              />
            </label>
            <div className="text-sm text-gray-400 mt-1">
              Recommended size: 128x128px
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
                      const filterData = data?.payments?.filter(
                        (payment: any) => {
                          return payment.status === status; // Use the status directly here
                        }
                      );
                      console.log(filterData, "Filtered Data");
                      setFilter(filterData);
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
          {(filter?.length > 0 ? filter : data?.payments)?.map(
            (approval, index) => {
              const date = new Date(approval.created_at).toLocaleDateString();

              return (
                <div key={index} className="bg-gray-700 rounded-lg p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <span>{approval.username}</span>
                        <span
                          className={`px-2 py-1 text-xs ${getStatusColor(
                            approval.status
                          )} rounded`}
                        >
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
                    <button className="p-1 text-gray-400 hover:text-white">
                      📋
                    </button>
                  </div>

                  <div className="flex justify-end gap-2 mt-2">
                    <button
                      className={`px-4 py-2 rounded text-white ${
                        buttonStates[index]?.rejectDisabled
                          ? "bg-red-300 cursor-not-allowed"
                          : "bg-red-500 hover:bg-red-600"
                      }`}
                      onClick={() => {
                        toggleButtonState(index, "reject");
                        updateStatus({
                          status: "Reject",
                          email: approval.user_email,
                          totalSpot: approval.grid,
                        });
                      }}
                      disabled={buttonStates[index]?.rejectDisabled}
                    >
                      Reject
                    </button>
                    <button
                      className={`px-4 py-2 rounded text-white ${
                        buttonStates[index]?.approveDisabled
                          ? "bg-green-300 cursor-not-allowed"
                          : "bg-green-500 hover:bg-green-600"
                      }`}
                      onClick={() => {
                        toggleButtonState(index, "approve");
                        updateStatus({
                          status: "Approve",
                          email: approval.user_email,
                          totalSpot: approval.grid,
                        });
                      }}
                      disabled={buttonStates[index]?.approveDisabled}
                    >
                      Approve
                    </button>
                  </div>
                </div>
              );
            }
          )}
        </div>
      </div>
    </div>
  );
};

export default ViewDashboard;
