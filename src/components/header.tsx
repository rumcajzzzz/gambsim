'use client'
import "@styles/header.css"; 

import {
	SignInButton,
	SignUpButton,
	SignedIn,
	SignedOut,
	UserButton,
	useUser,
  } from '@clerk/nextjs'
import { Navigation } from './navigation'
import Link from "next/link";

const Header = () => {
  const { user } = useUser() 

  return (
    <header
      className={`flex font-bold justify-between items-center p-4 gap-4 h-16 headdy relative`}
    > 
              <span className="pointer-events-none absolute inset-0 flex items-center justify-center text-3xl text-center font-bold text-gray-400 z-0">
                <span className="text-red-700">Gamb</span><span className="text-green-700">SIM</span>
              </span>
              <span className="pointer-events-none absolute inset-0 flex items-center justify-center text-sm top-10 text-center font-bold text-gray-400 opacity-5 z-0">
                ALPHA VERSION
            </span>
          <div className='flex items-center'>
            <div>
              <img src="/rmzclogo.svg" alt="Logo" className="w-30 h-30 logo-img"/>
            </div>

            <Navigation />

          </div>

          <div className='flex items-center mx-20'>
            <SignedOut>
                <SignInButton />
                <SignUpButton />
              </SignedOut>    
            <SignedIn>
              <div>
                <Link href={`/profile/${user?.username} `} target="_blank">
                  <span className="mx-10">{user?.username || user?.firstName || ''}</span>
                </Link>
              </div>
              <UserButton />
            </SignedIn>
          </div>

    </header>
  )
}

export default Header
