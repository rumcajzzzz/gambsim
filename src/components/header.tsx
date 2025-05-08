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

const Header = () => {
  const { user } = useUser() 

  return (
    <header
      className={`flex mx-10 my-15 font-bold justify-between items-center p-4 gap-4 h-16 headdy`}
    > 
          <div className='flex items-center'>
            <div>
              <img src="/rmzclogo.svg" alt="Logo" className="w-40 h-40 logo-img"/>
            </div>

            <Navigation />

            <SignedOut>
              <SignInButton />
              <SignUpButton />
            </SignedOut>
          </div>

          <div className='flex items-center mx-20'>
            <SignedIn>
              <div>
                <span className="mx-10">{user?.username || user?.firstName || ''}</span>
              </div>
              <UserButton />
            </SignedIn>
          </div>

    </header>
  )
}

export default Header
