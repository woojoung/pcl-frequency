'use client'
import React, { useRef, useState, useEffect } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation';

export default function Login() {
  const [pins, setPins] = useState(['', '', '', '']);
  const inputRefs: any = useRef([0, 1, 2, 3].map(() => useRef(null)));
  const router = useRouter()


  const handleSubmit = async () => {
    const pinNumber = pins.join('');
    console.log('입력된 핀 넘버:', pinNumber);
    if(pinNumber.length !== 4) return;

    await signIn("credentials", {
      password: pinNumber,
      redirect: false
    }).then((result)=>{
      if(result?.ok){
        router.push('/main')
      } else {
        // TODO. 로그인 실패 처리 
        router.push('/')
      }
    });
    
  }


  const handleChange = async (index: number, value: string) => {
    
    let newPins = [];
    // 입력값이 숫자이고, 4자리인지 확인
    if (/^\d+$/.test(value) && value.length <= 1) {
      console.log('index', index);
      console.log('value', value);
      newPins = [...pins];
      newPins[index] = value;
      setPins(newPins);
      console.log('newPins', JSON.stringify(newPins));
    }

    // 입력값이 변경될 때 해당 입력란으로 포커스 이동
    if (index < inputRefs.current.length - 1) {
      inputRefs.current[index + 1].current?.focus();
    }
    console.log('inputRefs', inputRefs);

    
  };

  useEffect(() => {
    handleSubmit();
  }, [pins]);
  
    return (
      <main className='flex min-h-screen flex-col items-center space-y-12 p-24' style={{ backgroundImage: 'url("/login.png")', backgroundSize: 'cover' }}>
        <h1 className="mt-4 text-center text-6xl font-bold" style={{color: '#0C3659'}}>Wave Maker</h1>
        <p className="mt-2 text-center text-lg text-gray-600" style={{color: '#0C3659'}}>Break Time</p>
        <div>
          <div style={{ display: 'flex', marginBottom: '10px' }}>
              {pins.map((pin, index) => (
                <input
                  key={index}
                  type="text"
                  value={pin}
                  onChange={(e) => handleChange(index, e.target.value)}
                  maxLength={1}
                  ref={inputRefs.current[index]}
                  className="w-14 text-center text-lg font-semibold border rounded-md p-2 bg-gray-400"
                  style={{
                    width: '50px', // 각 입력란의 너비 조절
                    marginRight: '10px', // 입력란 간의 간격 조절
                    border: '1px solid #ccc',
                    textAlign: 'center',
                    color: 'black', // 텍스트 색상을 빨간색으로 지정
                  }}
                />
                
              ))}
            </div>
        </div>
      </main>
    )
  }
  
