'use client'
import React, { useRef, useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'

/**
 * v0 by Vercel.
 * @see https://v0.dev/t/0UoNA5t2BOk
 */
export default function Component() {
  const { data: session } = useSession();
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      const response = await fetch('/api/users', {method:'GET'});
      console.log('response', response);
      const data = await response.json();
      console.log('data', data);
      setUsers(data.users);
    };

    fetchUsers();
  }, []);

  const user: any = users.find((u: any) => u.name === session?.user?.name);

  console.log('users', users);
  return (
    <div className="bg-white rounded-lg shadow-md p-4 mx-auto">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-gray-400"style={{color: '#0C3659'}}>Wave Maker Frequency</h2>
      </div>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <span className="text-sm text-gray-500 ml-1" style={{color: '#0C3659'}}>{user ? `${6 - user.count}` : 0}★ until break time</span>
        </div>
        <div className="flex items-baseline">
          <span className="text-3xl font-semibold" style={{color: '#0C3659'}}>{user ? `${user.count}` : 0}</span>
          <span className="text-lg text-gray-500 ml-1">/6★</span>
        </div>
      </div>

      <div className="mb-4 relative">
        <img
          className="w-full h-auto rounded-lg"
          height="550"
          // src="/login.png"
          style={{
            aspectRatio: "300/150",
            objectFit: "cover",
            backgroundImage: 'url("/login.png")', backgroundSize: 'cover'
          }}
          width="300"
        />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white text-center">
          <h1 className="mt-4 text-center text-3xl font-bold" style={{color: '#0C3659'}}>Wave Maker</h1>
          <p className="mt-2 text-center text-lg text-gray-600" style={{color: '#0C3659'}}>Break Time</p>
          <h1 className="mt-4 text-center text-3xl font-bold" style={{color: '#0C3659'}}>{session ? `${session.user?.name}` : ''}</h1>
        </div>
        
      </div>
      
      <div className="flex justify-center items-center">
        <div className="bg-gray-100 p-2 rounded-lg">
          <div className="flex space-x-1">
            {(() => {
              const stars = [];
              for (let index = 0; index < 6; index++) {
                stars.push(<div key={index} className="w-12 h-6">
                  {index < user?.count ? (
                    <StarIcon color="#0C3659" style={{ color: '#0C3659' }} />
                  ) : (
                    <StarIcon className="text-gray-300" color="" />
                  )}
                </div>)
              }
              return stars;
            })()}
          </div>
        </div>
      </div>
      <br></br>
      

    </div>
    
    
    
  )
}


function StarIcon({ color, ...props } : any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" fill={color}/>
    </svg>
  )
}

