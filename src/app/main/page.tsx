'use client'
import React, { useRef, useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import firestore from "../firebase/firestore";
import { doc, getDoc, getDocs, collection, where, query, getFirestore, addDoc } from 'firebase/firestore';

/**
 * v0 by Vercel.
 * @see https://v0.dev/t/0UoNA5t2BOk
 */
export default function Component() {
  const { data: session } = useSession();
  const [user, setUser] = useState({name: ''});
  const [users, setUsers] = useState([]);
  const [total, setTotalFrequency] = useState(0);

  const findUsers = async () => {
    const usersRef = query(collection(firestore, "users"))
    const usersSnapshot = await getDocs(usersRef)
    if (usersSnapshot.empty) {
      console.log("일치하는 사용자가 없습니다.");
      setUsers([]);
    } 
    const users: any = usersSnapshot.docs.map((doc) => doc.data());
    console.log('users: ', users)
    setUsers(users)

    const user: any = users.find((u: any) => u.name === session?.user?.name);

    if (user){
      setUser(user);
      let totalFrequency = Object.keys(user)
      .filter(key => key !== "id" && key !== "name" && key !== "password" && key !== "count")
      .reduce((sum, key) => sum + user[key], 0)
      totalFrequency = totalFrequency > 14 ? 14 : totalFrequency;
      setTotalFrequency(totalFrequency ?? 0);
    }

    
  };

  useEffect(() => {
    findUsers();
  }, []);

  
  // console.log('session?.user?.name', JSON.stringify(session));
  // console.log('users', users);
  // console.log('user', user);
  return (
    <div className="bg-white rounded-lg shadow-md p-4 mx-auto">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-gray-400"style={{color: '#0C3659'}}>Wave Maker Frequency</h2>
      </div>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <span className="text-sm text-gray-500 ml-1" style={{color: '#0C3659'}}>{user ? `${14 - total}` : 0}★ until break time</span>
        </div>
        <div className="flex items-baseline">
          <span className="text-3xl font-semibold" style={{color: '#0C3659'}}>{user ? `${total}` : 0}</span>
          <span className="text-lg text-gray-500 ml-1">/14★</span>
        </div>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-1.5 mt-2 relative">
        <div
          className="h-full bg-blue-500 rounded-full"
          style={{ width: `${Math.round((total/14)*100).toFixed(0)}%` }}
        ></div>
      </div>
      <br></br>

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
          <h1 className="mt-4 text-center text-3xl font-bold" style={{color: '#0C3659'}}>{session ? `${user.name}` : ''}</h1>
        </div>
        
      </div>
      
      <div className="flex justify-center items-center">
        <div className="bg-gray-100 p-2 rounded-lg">
          <div className="flex flex-wrap gap-1">
            {(() => {
              const stars = [];
              for (let index = 0; index < 14; index++) {
                stars.push(<div key={index} className="w-12 h-6">
                  {index < total ? (
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

