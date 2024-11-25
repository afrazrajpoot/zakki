"use client"

import React, { useState, useEffect } from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Input from '@mui/material/Input';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import { Bitcoin, ChevronDown, CircleDollarSign, Coins, Copy, Check, ArrowLeft } from 'lucide-react';
import { Label } from '@mui/icons-material';
import { useAddPaymentMutation, useGetPaymentDataQuery, useGetPriceQuery, useGetSpotQuery, useGetTokenQuery } from '@/store/storeApi';
import { useAuth } from '@/providers/AuthProvider';
import { useRouter, useSearchParams } from 'next/navigation';
import toast from 'react-hot-toast';

const PaymentInterface = () => {

  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      @keyframes tickerScroll {
        0% { transform: translateX(0); }
        100% { transform: translateX(-50%); }
      }
      .ticker-scroll {
        animation: tickerScroll 30s linear infinite;
      }
      .ticker-scroll:hover {
        animation-play-state: paused;
      }
    `;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);
  const searchParams = useSearchParams()
  const pixels = searchParams.get('pixels');
const navigate = useRouter()

  const [paymentMethod, setPaymentMethod] = useState('crypto');
  const [isTokenDropdownOpen, setIsTokenDropdownOpen] = useState(false);
  const [error, setError] = useState('');
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [showCryptoConfirmation, setShowCryptoConfirmation] = useState(false);
  const [copied, setCopied] = useState(false);
  const [copiedName, setCopiedName] = useState(false);
  const [userPaymentAddress, setUserPaymentAddress] = useState('');
  const [grid,setGrid] = useState<number>(null);
  const [amount,setAmount] = useState(null);
  const [isAddressVerified, setIsAddressVerified] = useState(false);
  const [cryptoDetails, setCryptoDetails] = useState({
    email: '',
    currency: '',
  });
const [addPayment,{isLoading,isError,isSuccess}] = useAddPaymentMutation()
const {isLoading:getPriceLoading,data:getPrice} = useGetPriceQuery()
const {isLoading:getSpotLoading,data:getSpotData} = useGetSpotQuery()
const {isLoading:getTokenLoading,isError:getTokenError,data:getTokenData} = useGetTokenQuery()
  const CRYPTO_ADDRESS = 'RwpMvodxg5a14w';
  const CRYPTO_NAME = 'PixelCraft Gallery';
  const PIXELS_AMOUNT = '541037';

  const tickerTokens = [
    { 
      symbol: <div className="bg-orange-500 rounded-full p-2 w-12 h-12 flex items-center justify-center text-white">
        <Bitcoin className="w-8 h-8" />
      </div>, 
      price: '$40,123' 
    },
    { 
      symbol: <div className="bg-purple-500 rounded-full p-2 w-12 h-12 flex items-center justify-center text-white">
        <CircleDollarSign className="w-8 h-8" />
      </div>, 
      price: '$2,456' 
    },
    { 
      symbol: <div className="bg-teal-500 rounded-full p-2 w-12 h-12 flex items-center justify-center text-white">
        <Coins className="w-8 h-8" />
      </div>, 
      price: '$98.76' 
    },
    { 
      symbol: <div className="bg-gray-500 rounded-full p-2 w-12 h-12 flex items-center justify-center text-white">
        <Coins className="w-8 h-8" />
      </div>, 
      price: '$1.23' 
    }
  ];

  const availableTokens = [
    { 
      name: 'Ethereum', 
      symbol: 'ETH', 
      value: 'ethereum',
      logo: <CircleDollarSign className="h-5 w-5 text-purple-500" />
    },
    { 
      name: 'Bitcoin', 
      symbol: 'BTC', 
      value: 'bitcoin',
      logo: <Bitcoin className="h-5 w-5 text-orange-500" />
    },
    { 
      name: 'Solana', 
      symbol: 'SOL', 
      value: 'solana',
      logo: <Coins className="h-5 w-5 text-blue-500" />
    }
  ];

  const selectedToken = availableTokens.find(token => token.value === cryptoDetails.currency);

  const handleSubmit = (e:any) => {
    e.preventDefault();
    if (paymentMethod === 'paypal') {
      setShowConfirmation(true);
      return;
    }
    if (!cryptoDetails.email || !cryptoDetails.currency) {
      setError('Please fill in all required fields');
      return;
    }
    setShowCryptoConfirmation(true);
  };

  const handleCopyAddress = () => {
    navigator.clipboard.writeText(CRYPTO_ADDRESS);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleCopyName = () => {
    navigator.clipboard.writeText(CRYPTO_NAME);
    setCopiedName(true);
    setTimeout(() => setCopiedName(false), 2000);
  };
  const handleAddPayment = async () => {
   
    try {
      await addPayment({
        email: cryptoDetails.email,
        currency: cryptoDetails.currency,
        wallet_address: userPaymentAddress,
        amount: parseInt(getPrice?.data[0]?.price_per_grid) * parseInt(pixels),
        grid: parseInt(pixels),
      });
      // Success logic
    } catch (error) {
      console.error("Payment failed", error);
    }
  };
  useEffect(()=>{
    if(isError){
      toast.error('Payment failed please try again',{
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      })
    }
    if(isSuccess){
      toast.success('payment in processing till Admin approve',{
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      })

        setShowCryptoConfirmation(false);
                  setCryptoDetails({ email: '', currency: '' });
                  setUserPaymentAddress('');
                   setIsAddressVerified(false);
    }
  //  navigate.push('/')
  },[isSuccess,isError])
console.log(getTokenData?.data,'token data')
  if (showCryptoConfirmation) {
    return (
      <div className="w-full max-w-md mx-auto p-4">
        <Card className="bg-gradient-to-br from-purple-600 via-pink-500 to-orange-400 p-0.5">
          <CardContent className="relative p-6 bg-white rounded-lg">
            <button 
              onClick={() => setShowCryptoConfirmation(false)}
              className="absolute left-4 top-4 flex items-center gap-2 text-teal-600"
            >
              <ArrowLeft className="h-3 w-3" />
              <span>Back</span>
            </button>

            <div className="text-center space-y-6 mt-8">
              <div className="space-y-2">
                <h2 className="text-4xl font-bold tracking-tight text-purple-600">Welcome TCHM</h2>
                <p className="text-2xl font-medium text-orange-500">Spots {getSpotData?.data[0]?.totalSpot}</p>
              </div>

              <div className="bg-purple-50 p-8 rounded-lg space-y-8">
                <div className="space-y-4">
                  <p className="text-xl font-medium text-purple-600">Wallet Address</p>
                  <div className="flex items-center justify-center space-x-2">
                    <div className="bg-white px-4 py-2 rounded">
                      <code className="text-orange-500">{getPrice?.data[0]?.wallet_address}</code>
                    </div>
                    <button
                      onClick={handleCopyAddress}
                      className="p-2 hover:bg-purple-100 rounded-lg transition-colors"
                    >
                      {copied ? (
                        <Check className="h-5 w-5 text-purple-500" />
                      ) : (
                        <Copy className="h-5 w-5 text-purple-500" />
                      )}
                    </button>
                  </div>
                </div>

                <div className="space-y-4">
                  <p className="text-xl font-medium text-purple-600">Wallet Name</p>
                  <div className="flex items-center justify-center space-x-2">
                    <div className="bg-white px-4 py-2 rounded">
                      <code className="text-orange-500">{getPrice?.data[0]?.wallet_name}</code>
                    </div>
                    <button
                      onClick={handleCopyName}
                      className="p-2 hover:bg-purple-100 rounded-lg transition-colors"
                    >
                      {copiedName ? (
                        <Check className="h-5 w-5 text-purple-500" />
                      ) : (
                        <Copy className="h-5 w-5 text-purple-500" />
                      )}
                    </button>
                  </div>
                  <div className="flex justify-center mt-4">
                    <img src={`http://localhost:8081/${getPrice?.data[0]?.walletQrCode?.split('/')[1]}`} alt="QR Code" className="rounded-lg" />
                  </div>
                </div>

                <div className="space-y-4">
                  <p className="text-xl font-medium text-purple-600">Your Wallet Address</p>
                  <input
                    value={userPaymentAddress}
                    onChange={(e) => setUserPaymentAddress(e.target.value)}
                    className="mt-1 border-2 border-purple-200 p-[0.5vw] outline-none w-full focus:border-purple-400"
                    placeholder="Paste the address you paid from"
                  />
                  

                  <div className="flex items-center justify-center space-x-2">
                    <Checkbox 
                      id="address-verify" 
                      // checked={isAddressVerified}
                      onChange={()=>setIsAddressVerified(true)}
                      className="border-2 border-purple-200"
                    />
                    <label 
                      htmlFor="address-verify"
                      className="text-sm text-purple-600 cursor-pointer"
                    >
                      I confirm this is the address I paid from
                    </label>
                  </div>
                </div>
              </div>

              <Button
             
                onClick={handleAddPayment}
                className="w-full bg-gradient-to-r from-purple-400 to-pink-400 text-white py-6 text-xl hover:from-purple-500 hover:to-pink-500 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl"
                disabled={!isAddressVerified || !userPaymentAddress}
              >
                Confirm
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md mx-auto p-4">
      <Card className="bg-gradient-to-br h-[40vw] from-purple-600 via-pink-500 to-orange-400 p-0.5">
        <CardContent className="p-6 bg-white h-full rounded-lg">
          {/* Token Ticker */}
          <div className="w-full bg-gradient-to-r from-purple-50 to-pink-50 border-2 border-purple-200 rounded-lg mb-4 overflow-hidden">
            <div className="py-8">
              <div className="ticker-scroll flex whitespace-nowrap">
              {getTokenData?.data.map((token: any, index: any) => (
  <div
    key={index}
    className="inline-flex flex-col items-center justify-center mx-6 rounded-lg p-4 hover:shadow-xl transform hover:scale-105 transition duration-300"
  >
    <figure className="w-16 h-16 rounded-full overflow-hidden border-2 border-blue-500 mb-3">
      <img
        src={`http://localhost:8081/${token.token_icon.split("/")[1]}`}
        alt="img"
        className="w-full h-full object-cover"
      />
    </figure>
    <span className="text-base font-semibold text-gray-800">{token.token_name}</span>
    {/* Uncomment the below span to include the price */}
    {/* <span className="text-xs text-gray-600 mt-1">{token.price}</span> */}
  </div>
))}

              </div>
            </div>
          </div>

          {/* Crypto Option */}
          <div 
            onClick={() => {
              setPaymentMethod('crypto');
              setError('');
            }}
            className="w-full bg-gradient-to-r from-orange-50 to-pink-50 border-2 border-orange-200 rounded-lg mb-4 cursor-pointer transform transition-transform hover:scale-105"
          >
            <div className="flex flex-col items-center justify-center py-8">
              <Bitcoin className="w-6 h-6 mb-1 text-orange-500" />
              <span className="text-[14px] mb-0.5 text-orange-600">Cryptocurrency</span>
              <span className="text-sm text-orange-400">${parseInt(getPrice?.data[0]?.price_per_grid) * parseInt(pixels)}</span>
            </div>
          </div>

          {/* Crypto Form */}
          {paymentMethod === 'crypto' && (
            <div className="space-y-4">
                <label htmlFor="email"  className="text-purple-600 font-bold">Your Email</label>
              <div>
                <input
                  id="email"
                  type="email"
                  value={cryptoDetails.email}
                  onChange={(e) => setCryptoDetails({...cryptoDetails, email: e.target.value})}
                  className="mt-1 border-2 border-purple-200 p-[0.5vw] outline-none w-full focus:border-purple-400"
                  placeholder="Enter your email"
                />
              </div>

              <div>
                <label className="text-purple-600 font-bold">Available Blockchains</label>
                <div className="relative mt-1">
                  <div
                    onClick={() => setIsTokenDropdownOpen(!isTokenDropdownOpen)}
                    className="relative w-full border-2 border-purple-200 rounded-lg p-2 flex items-center justify-between cursor-pointer bg-gradient-to-r from-purple-50 to-pink-50"
                  >
                    <div className="flex items-center gap-2">
                      {selectedToken ? (
                        <>
                          {selectedToken.logo}
                          <span>{selectedToken.name} ({selectedToken.symbol})</span>
                        </>
                      ) : (
                        <span className="text-gray-500">Select Token</span>
                      )}
                    </div>
                    <ChevronDown className={` w-5 text-purple-500 transition-transform ${isTokenDropdownOpen ? 'rotate-180' : ''}`} />
                  </div>

                  {isTokenDropdownOpen && (
                    <div className="absolute z-50 w-full mt-1 bg-white border-2 border-purple-200 rounded-lg shadow-lg">
                      {availableTokens.map((token) => (
                        <div
                          key={token.value}
                          className="flex items-center gap-2 p-2 hover:bg-gradient-to-r hover:from-purple-50 hover:to-pink-50 cursor-pointer"
                          onClick={() => {
                            setCryptoDetails({...cryptoDetails, currency: token.value});
                            setIsTokenDropdownOpen(false);
                          }}
                        >
                          {token.logo}
                          <span>{token.name} ({token.symbol})</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {error && (
            <div className="mt-4 p-2 bg-red-50 border-2 border-red-200 text-red-600 rounded text-sm">
              {error}
            </div>
          )}

          <Button
            onClick={handleSubmit}
            className="w-full bg-gradient-to-r from-purple-600 to-pink-500 text-white mt-4 hover:from-purple-700 hover:to-pink-600 transform transition-transform hover:scale-105"
          >
            Continue
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default PaymentInterface;
