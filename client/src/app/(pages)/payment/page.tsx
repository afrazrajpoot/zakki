"use client"

import React, { useState, useEffect } from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Input from '@mui/material/Input';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import { Bitcoin, ChevronDown, CircleDollarSign, Coins, Copy, Check, ArrowLeft } from 'lucide-react';
import { Label } from '@mui/icons-material';
import { useAddPaymentMutation } from '@/store/storeApi';

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

  const [paymentMethod, setPaymentMethod] = useState('crypto');
  const [isTokenDropdownOpen, setIsTokenDropdownOpen] = useState(false);
  const [error, setError] = useState('');
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [showCryptoConfirmation, setShowCryptoConfirmation] = useState(false);
  const [copied, setCopied] = useState(false);
  const [copiedName, setCopiedName] = useState(false);
  const [userPaymentAddress, setUserPaymentAddress] = useState('');
  const [grid,setGrid] = useState(null);
  const [amount,setAmount] = useState(null);
  const [isAddressVerified, setIsAddressVerified] = useState(false);
  const [cryptoDetails, setCryptoDetails] = useState({
    email: '',
    currency: '',
  });
const [addPayment,{isLoading,isError,isSuccess}] = useAddPaymentMutation()

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

  const handleSubmit = (e) => {
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
  useEffect(()=>{
    if(isSuccess){
        setShowCryptoConfirmation(false);
                  setCryptoDetails({ email: '', currency: '' });
                  setUserPaymentAddress('');
                   setIsAddressVerified(false);
    }
   
  },[isSuccess])
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
                <p className="text-2xl font-medium text-orange-500">Spots {PIXELS_AMOUNT}</p>
              </div>

              <div className="bg-purple-50 p-8 rounded-lg space-y-8">
                <div className="space-y-4">
                  <p className="text-xl font-medium text-purple-600">Wallet Address</p>
                  <div className="flex items-center justify-center space-x-2">
                    <div className="bg-white px-4 py-2 rounded">
                      <code className="text-orange-500">{CRYPTO_ADDRESS}</code>
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
                      <code className="text-orange-500">{CRYPTO_NAME}</code>
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
                    <img src="/api/placeholder/100/100" alt="QR Code" className="rounded-lg" />
                  </div>
                </div>

                <div className="space-y-4">
                  <p className="text-xl font-medium text-purple-600">Your Wallet Address</p>
                  <Input
                    value={userPaymentAddress}
                    onChange={(e) => setUserPaymentAddress(e.target.value)}
                    className="text-center bg-white"
                    placeholder="Paste the address you paid from"
                  />
                    <p className="text-xl font-medium text-purple-600">Grid</p>
                  <Input
                    value={grid}
                    onChange={(e) => setGrid(e.target.value)}
                    className="text-center bg-white"
                    placeholder="Paste the address you paid from"
                  />

<p className="text-xl font-medium text-purple-600">Amount</p>
                  <Input
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="text-center bg-white"
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
                onClick={() => {
                 
               
                  addPayment({email:cryptoDetails.email, currency:cryptoDetails.currency,wallet_address:userPaymentAddress,amount:parseInt(amount),grid:parseInt(grid)})

                }}
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
      <Card className="bg-gradient-to-br from-purple-600 via-pink-500 to-orange-400 p-0.5">
        <CardContent className="p-6 bg-white rounded-lg">
          {/* Token Ticker */}
          <div className="w-full bg-gradient-to-r from-purple-50 to-pink-50 border-2 border-purple-200 rounded-lg mb-4 overflow-hidden">
            <div className="py-8">
              <div className="ticker-scroll flex whitespace-nowrap">
                {[...tickerTokens, ...tickerTokens].map((token, index) => (
                  <div key={index} className="inline-flex flex-col items-center justify-center mx-6">
                    {token.symbol}
                    <span className="text-xs text-gray-600 mt-2">
                      {token.price}
                    </span>
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
              <span className="text-sm text-orange-400">$12</span>
            </div>
          </div>

          {/* Crypto Form */}
          {paymentMethod === 'crypto' && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="email" className="text-purple-600">Your Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={cryptoDetails.email}
                  onChange={(e) => setCryptoDetails({...cryptoDetails, email: e.target.value})}
                  className="mt-1 border-2 border-purple-200 focus:border-purple-400"
                  placeholder="Enter your email"
                />
              </div>

              <div>
                <Label className="text-purple-600">Available Blockchains</Label>
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
                    <ChevronDown className={`h-5 w-5 text-purple-500 transition-transform ${isTokenDropdownOpen ? 'rotate-180' : ''}`} />
                  </div>

                  {isTokenDropdownOpen && (
                    <div className="absolute z-10 w-full mt-1 bg-white border-2 border-purple-200 rounded-lg shadow-lg">
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
