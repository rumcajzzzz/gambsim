'use client'

import {
	SignInButton,
	SignUpButton,
	SignedIn,
	SignedOut,
	UserButton,
	useUser,
  } from '@clerk/nextjs'

const Header = () => {
  const { user, isSignedIn } = useUser() 

  return (
    <header
      className={`flex ${isSignedIn ? '' : 'bg-white text-black'} font-bold justify-center items-center p-4 gap-4 h-16`}
    >
	
      <SignedOut>
        <SignInButton />
        <SignUpButton />
      </SignedOut>
      <SignedIn>
        <UserButton />
		<div>
          <span className="mr-4">{user?.username || user?.firstName || ''}</span>
        </div>
      </SignedIn>
    </header>
  )
}

export default Header
