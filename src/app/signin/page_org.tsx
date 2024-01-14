'use client'
import React, { useRef } from 'react'
import { signIn } from 'next-auth/react'

export default function Login() {
    const passwordRef = useRef(null)
  
    const handleSubmit = async () => {
      console.log(passwordRef.current)

      const result = await signIn("credentials", {
        password: passwordRef.current,
        redirect: true,
        callbackUrl: "/",
      });
    }
  
    return (
      <main className='flex min-h-screen flex-col items-center space-y-10 p-24'>
        <h1 className='text-4xl font-semibold'>Login</h1>
        <div>
          
  
          <div className='mt-4'>
            <label
              htmlFor='password'
              className='block text-sm text-gray-800 dark:text-gray-200'
            >
              Password
            </label>
            <div className='mt-1'>
              <input
                type='password'
                id='password'
                name='password'
                ref={passwordRef}
                onChange={(e: any) => (passwordRef.current = e.target.value)}
                className='mt-2 block w-full rounded-md border bg-white px-4 py-2 text-gray-700 focus:border-blue-400 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-40 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 dark:focus:border-blue-300'
              />
            </div>
          </div>
  
          <div className='mt-6'>
            <button
              onClick={handleSubmit}
              className='w-full transform rounded-md bg-gray-700 px-4 py-2 tracking-wide text-white transition-colors duration-200 hover:bg-gray-600 focus:bg-gray-600 focus:outline-none'
            >
              Log In
            </button>
          </div>
        </div>
      </main>
    )
  }
  
