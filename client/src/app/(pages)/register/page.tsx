"use client";

import React from 'react';

const SimpleStep = ({ number, text }) => (
  <div className="flex items-center gap-4 mb-6 pixel-border">
    <div className="flex-shrink-0 w-8 h-8 pixel-box flex items-center justify-center bg-[#4a90e2] border-pixel">
      <span className="text-white pixel-font">{number}</span>
    </div>
    <p className="text-white pixel-font text-shadow">{text}</p>
  </div>
);

const SocialButton = ({ platform }) => {
  const styles = {
    twitter: { 
      color: '#FF6B6B',
      label: 'LOGIN WITH TWITTER',
      handler: () => window.open('https://twitter.com/oauth/authorize', '_blank')
    },
    facebook: { 
      color: '#4ECDC4',
      label: 'LOGIN WITH FACEBOOK',
      handler: () => window.open('https://facebook.com/dialog/oauth', '_blank')
    },
    google: { 
      color: '#FFE66D',
      label: 'LOGIN WITH GOOGLE',
      handler: () => window.open('https://accounts.google.com/o/oauth2/auth', '_blank')
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
  return (
    // THIS IS THE ONLY LINE I'M CHANGING - Adding the background gradient here
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
            <SimpleStep number="1" text="SELECT LOGIN METHOD" />
            <SimpleStep number="2" text="ENTER USERNAME" />
            <SimpleStep number="3" text="PROVIDE EMAIL" />
            <SimpleStep number="4" text="SECURE PASSWORD" />
            <SimpleStep number="5" text="ACCEPT RULES" />
          </div>
        </div>

        {/* Right Side - Login Form */}
        <div className="w-1/2 pr-8 relative">
          <div className="max-w-md mx-auto">
            <SocialButton platform="twitter" />
            <SocialButton platform="facebook" />
            <SocialButton platform="google" />

            <div className="text-center my-6">
              <span className="pixel-font text-white">OR</span>
            </div>

            <div className="space-y-4">
              <input
                placeholder="USERNAME"
                className="w-full p-4 border-2 border-black bg-transparent text-white pixel-font"
              />
              <input
                placeholder="EMAIL"
                className="w-full p-4 border-2 border-black bg-transparent text-white pixel-font"
              />
              <input
                type="password"
                placeholder="PASSWORD"
                className="w-full p-4 border-2 border-black bg-transparent text-white pixel-font"
              />

              <div className="flex items-center">
                <input type="checkbox" className="pixel-checkbox" />
                <span className="ml-2 text-white pixel-font text-sm">
                  I AGREE TO THE RULES OF THE GAME
                </span>
              </div>

              <button className="w-full relative transition-transform hover:translate-y-[-2px] active:translate-y-[2px]">
                <div className="absolute inset-0 bg-black translate-y-1" />
                <div className="relative p-4 bg-[#4a90e2] border-pixel">
                  <span className="pixel-font text-white text-shadow">START GAME</span>
                </div>
              </button>
            </div>
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