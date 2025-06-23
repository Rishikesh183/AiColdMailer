import React from 'react'
import {
    ClerkProvider,
    SignInButton,
    SignUpButton,
    SignedIn,
    SignedOut,
    UserButton,
} from '@clerk/nextjs'
const Navbar = () => {
    return (
        <>
            <div className=' p-6 flex items-baseline justify-between bg-gray-800 text-white shadow-lg'>
                <h1 className='font-extrabold text-2xl text-blue-400 tracking-wide'>Cold Email</h1>
                <SignedOut >
                    <div className='font-bold text-lg px-4 py-2 rounded-full bg-blue-500 hover:bg-blue-600 transition duration-300 ease-in-out transform hover:scale-105'>
                        <SignUpButton />
                    </div>
                </SignedOut>
                <SignedIn>
                    <UserButton />
                </SignedIn>
                
            </div>
        </>

    )
}

export default Navbar