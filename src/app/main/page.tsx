'use client'
import React, { useRef, useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation';
import firestore from "../firebase/firestore";
import { doc, getDoc, getDocs, collection, where, query, getFirestore, addDoc } from 'firebase/firestore';

/**
 * v0 by Vercel.
 * @see https://v0.dev/t/0UoNA5t2BOk
 */
export default function Component() {
  const { data: session } = useSession();
  const router = useRouter();

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
    // // 페이지가 마운트될 때 세션을 확인
    // if (typeof session === 'undefined') {
    //   // 세션 정보가 없으면 로그인 페이지로 리디렉션
    //   alert('세션 만료')
    //   router.push('/');
    // }
    findUsers();
  }, [session, router]);

  
  // console.log('session?.user?.name', JSON.stringify(session));
  // console.log('users', users);
  // console.log('user', user);
  return (
    <div className="bg-white p-4 rounded-lg shadow-md max-w-md mx-auto">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-gray-400"style={{color: '#0C3659'}}>Wave Maker Frequency</h2>
      </div>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <span className="text-sm text-gray-500 ml-1" style={{color: '#0C3659'}}>{user ? `${14 - total}` : 0}</span>
          <span><FrequencyIcon color="#0C3659" width={10} height={10} style={{ color: '#0C3659' }} /></span>
          <span className="text-sm text-gray-500 ml-1" style={{color: '#0C3659'}}>until break time</span>
          
        </div>
        <div className="flex items-baseline">
          <span className="text-3xl font-semibold" style={{color: '#0C3659'}}>{user ? `${total}` : 0}</span>
          {/* <span className="text-lg text-gray-500 ml-1">/14★</span> */}
          <span className="text-lg text-gray-500 ml-1">/14</span>
          <span><FrequencyIcon color="#0C3659" width={15} height={15} style={{ color: '#0C3659' }} /></span>
        </div>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-1.5 mt-2 relative">
        <div
          className="h-full rounded-full"
          style={{ width: `${Math.round((total/14)*100).toFixed(0)}%`, backgroundColor: '#0C3659'}}
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
            backgroundImage: 'url("/wavemaker.png")', backgroundSize: 'cover'
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
                    // <StarIcon color="#0C3659" style={{ color: '#0C3659' }} />
                    <FrequencyIcon color="#0C3659" style={{ color: '#0C3659' }} />
                  ) : (
                    // <StarIcon className="text-gray-300" color="" />
                    <FrequencyShadowIcon className="text-gray-300" color="" />
                  )}
                </div>)
                // Add a new row every 5 stars
                if ((index + 1) % 5 === 0) {
                  stars.push(<div key={`row-${index}`} className="w-full h-2" />);
                }
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

function FrequencyIcon({ color, ...props } : any) {
  return (
    <svg width="35" height="35" viewBox="0 0 35 35" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <g clipPath="url(#clip0_44_271)">
        <path d="M17.5 1.5C8.66 1.5 1.5 8.66 1.5 17.5C1.5 26.34 8.66 33.5 17.5 33.5C26.34 33.5 33.5 26.34 33.5 17.5C33.5 8.66 26.34 1.5 17.5 1.5ZM16.68 26.64C16.68 27.29 16.15 27.82 15.5 27.82C14.85 27.82 14.32 27.29 14.32 26.64V24.28C14.32 23.63 14.85 23.1 15.5 23.1C16.15 23.1 16.68 23.63 16.68 24.28V26.64ZM15.64 14.62H12.56V26.64C12.56 27.29 12.03 27.82 11.38 27.82C10.73 27.82 10.2 27.29 10.2 26.64V14.62H7.12C6.47 14.62 5.94 14.09 5.94 13.44C5.94 12.79 6.47 12.26 7.12 12.26H10.2V8.35C10.2 7.7 10.73 7.17 11.38 7.17C12.03 7.17 12.56 7.7 12.56 8.35V12.26H15.64C16.29 12.26 16.82 12.79 16.82 13.44C16.82 14.09 16.29 14.62 15.64 14.62ZM20.22 26.64C20.22 27.29 19.69 27.82 19.04 27.82C18.39 27.82 17.86 27.29 17.86 26.64V21.93C17.86 21.28 18.39 20.75 19.04 20.75C19.69 20.75 20.22 21.28 20.22 21.93V26.64ZM23.75 26.64C23.75 27.29 23.22 27.82 22.57 27.82C21.92 27.82 21.39 27.29 21.39 26.64V19.57C21.39 18.92 21.92 18.39 22.57 18.39C23.22 18.39 23.75 18.92 23.75 19.57V26.64ZM27.28 26.64C27.28 27.29 26.75 27.82 26.1 27.82C25.45 27.82 24.92 27.29 24.92 26.64V17.22C24.92 16.57 25.45 16.04 26.1 16.04C26.75 16.04 27.28 16.57 27.28 17.22V26.64Z" fill="#0C3659"/>
      </g>
      <defs>
        <clipPath id="clip0_44_271">
         <rect width="35" height="35" fill="white"/>
        </clipPath>
      </defs>
    </svg>
  )
}

function FrequencyShadowIcon({ color, ...props } : any) {
  return (
    <svg width="35" height="35" viewBox="0 0 35 35" fill="none" xmlns="http://www.w3.org/2000/svg" {...props} >
      <g clipPath="url(#clip0_44_17)">
        <path d="M17.5 1.5C8.66 1.5 1.5 8.66 1.5 17.5C1.5 26.34 8.66 33.5 17.5 33.5C26.34 33.5 33.5 26.34 33.5 17.5C33.5 8.66 26.34 1.5 17.5 1.5ZM16.68 26.64C16.68 27.29 16.15 27.82 15.5 27.82C14.85 27.82 14.32 27.29 14.32 26.64V24.28C14.32 23.63 14.85 23.1 15.5 23.1C16.15 23.1 16.68 23.63 16.68 24.28V26.64ZM15.64 14.62H12.56V26.64C12.56 27.29 12.03 27.82 11.38 27.82C10.73 27.82 10.2 27.29 10.2 26.64V14.62H7.12C6.47 14.62 5.94 14.09 5.94 13.44C5.94 12.79 6.47 12.26 7.12 12.26H10.2V8.35C10.2 7.7 10.73 7.17 11.38 7.17C12.03 7.17 12.56 7.7 12.56 8.35V12.26H15.64C16.29 12.26 16.82 12.79 16.82 13.44C16.82 14.09 16.29 14.62 15.64 14.62ZM20.22 26.64C20.22 27.29 19.69 27.82 19.04 27.82C18.39 27.82 17.86 27.29 17.86 26.64V21.93C17.86 21.28 18.39 20.75 19.04 20.75C19.69 20.75 20.22 21.28 20.22 21.93V26.64ZM23.75 26.64C23.75 27.29 23.22 27.82 22.57 27.82C21.92 27.82 21.39 27.29 21.39 26.64V19.57C21.39 18.92 21.92 18.39 22.57 18.39C23.22 18.39 23.75 18.92 23.75 19.57V26.64ZM27.28 26.64C27.28 27.29 26.75 27.82 26.1 27.82C25.45 27.82 24.92 27.29 24.92 26.64V17.22C24.92 16.57 25.45 16.04 26.1 16.04C26.75 16.04 27.28 16.57 27.28 17.22V26.64Z" fill="#DDDDDD"/>
      </g>
      <defs>
        <clipPath id="clip0_44_17">
          <rect width="35" height="35" fill="white"/>
        </clipPath>
      </defs>
    </svg>
  )
}
