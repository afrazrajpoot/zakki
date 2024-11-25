"use client";

import { useAuth } from '@/providers/AuthProvider';
import { useRegisterUserMutation } from '@/store/storeApi';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { useSession, signIn, signOut } from 'next-auth/react';
const SimpleStep = ({ number, text }: { number: number, text: string }) => (
  <div className="flex items-center gap-4 mb-6 pixel-border">
    <div className="flex-shrink-0 w-8 h-8 pixel-box flex items-center justify-center bg-[#4a90e2] border-pixel">
      <span className="text-white pixel-font">{number}</span>
    </div>
    <p className="text-white pixel-font text-shadow">{text}</p>
  </div>
);

const SocialButton = ({ platform }: { platform: any }) => {
  const styles = {
    twitter: {
      color: '#FF6B6B',
      label: 'LOGIN WITH TWITTER',
      // handler: () => window.open('https://twitter.com/oauth/authorize', '_blank')
    },
    facebook: {
      color: '#4ECDC4',
      label: 'LOGIN WITH FACEBOOK',
      // handler: () => window.open('https://facebook.com/dialog/oauth', '_blank')
    },
    google: {
      color: '#FFE66D',
      label: 'LOGIN WITH GOOGLE',
      // handler: () => window.open('https://accounts.google.com/o/oauth2/auth', '_blank')
    }
  };

  const style = styles[platform];

  return (
    <button
      onClick={style.handler}
      className="w-full mb-4 transition-transform hover:translate-y-[-2px] active:translate-y-[2px]"
    >
      <div className="relative">
        <div className="absolute inset-0 bg-black translate-y-1" />
        <div
          className="relative p-4 border-pixel"
          style={{ backgroundColor: style.color }}
        >
          <span className="text-white pixel-font text-shadow text-center block">
            {style.label}
          </span>
        </div>
      </div>
    </button>
  );
};

const RegistrationPage = () => {
  const [registerUser, { isLoading, isError,isSuccess,data }] = useRegisterUserMutation();
  const navigate = useRouter()
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    agreeToRules: false,
  });


  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.agreeToRules) {
      alert('You must agree to the rules.');
      return;
    }

    try {
      const { username, email, password } = formData;
      await registerUser({ username, email, password }).unwrap();
      // You can redirect the user after successful registration here
      alert('User registered successfully');
    } catch (err) {
      console.error('Error registering user:', err);
      alert('Registration failed. Please try again.');
    }
  };

useEffect(()=>{
  if(isSuccess){
    navigate.push('/login')
  }
},[isSuccess])
  return (
    <div className="min-h-screen flex relative" style={{ background: 'linear-gradient(135deg, #2b0f54 0%, #4a2996 50%, #130a2d 100%)' }}>
      <div className="absolute top-2 left-0 right-0 text-center py-2 z-20">
        <h1 className="text-5xl font-bold pixel-font relative inline-block">
          <span className="text-white relative z-10 text-shadow-xl tracking-wider">
            TOKENSCLUBHOUSE
          </span>
        </h1>
      </div>

      <div className="w-full flex pt-16">
        {/* Left Side - Instructions */}
        <div className="w-1/2 pl-2 pr-8">
          <div className="max-w-xl mx-auto">
            <SimpleStep number={1} text="SELECT LOGIN METHOD" />
            <SimpleStep number={2} text="ENTER USERNAME" />
            <SimpleStep number={3} text="PROVIDE EMAIL" />
            <SimpleStep number={4} text="SECURE PASSWORD" />
            <SimpleStep number={5} text="ACCEPT RULES" />
          </div>
        </div>

        {/* Right Side - Login Form */}
        <div className="w-1/2 pr-8 relative">
          <div className="max-w-md mx-auto">
          <a href="/api/auth/login"> <SocialButton platform="twitter" /></a>
           <a href="/api/auth/login"><SocialButton platform="facebook" /></a>
           <div onClick={() => signIn('google')}>

          <SocialButton platform="google" />
           </div>
         

            <div className="text-center my-6">
              <span className="pixel-font text-white">OR</span>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleInputChange}
                placeholder="USERNAME"
                className="w-full p-4 border-2 border-black bg-transparent text-white pixel-font"
              />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="EMAIL"
                className="w-full p-4 border-2 border-black bg-transparent text-white pixel-font"
              />
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                placeholder="PASSWORD"
                className="w-full p-4 border-2 border-black bg-transparent text-white pixel-font"
              />

              <div className="flex items-center">
                <input
                  type="checkbox"
                  name="agreeToRules"
                  checked={formData.agreeToRules}
                  onChange={handleInputChange}
                  className="pixel-checkbox"
                />
                <span className="ml-2 text-white pixel-font text-sm">
                  I AGREE TO THE RULES OF THE GAME
                </span>
              </div>

              <button type="submit" className="w-full relative transition-transform hover:translate-y-[-2px] active:translate-y-[2px]">
                <div className="absolute inset-0 bg-black translate-y-1" />
                <div className="relative p-4 bg-[#4a90e2] border-pixel">
                  <span className="pixel-font text-white text-shadow">
                    {isLoading ? 'REGISTERING...' : 'START GAME'}
                  </span>
                </div>*
              </button>
              {isError && <div className="text-red-500">Error during registration. Please try again.</div>}
             
            </form>
          </div>
        </div>
      </div>

      <style jsx global>{`
        .pixel-font {
          font-family: 'Press Start 2P', monospace;
          font-smooth: never;
          -webkit-font-smoothing: none;
        }
        .text-shadow {
          text-shadow: 2px 2px 0px rgba(0,0,0,0.5);
        }
        .border-pixel {
          border: 3px solid black;
          image-rendering: pixelated;
        }
        .pixel-checkbox {
          width: 16px;
          height: 16px;
          border: 2px solid black;
          appearance: none;
          background: transparent;
          position: relative;
        }
        .pixel-checkbox:checked:after {
          content: '';
          position: absolute;
          top: 2px;
          left: 2px;
          right: 2px;
          bottom: 2px;
          background: #4a90e2;
        }
      `}</style>
    </div>
  );
};

export default RegistrationPage;
