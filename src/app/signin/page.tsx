'use client'
import React, { useRef, useState, useEffect } from 'react'
import { signIn, useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation';

export default function Login() {
  const { data: session } = useSession();
  const [pins, setPins] = useState(['', '', '', '']);
  const inputRefs: any = useRef([0, 1, 2, 3].map(() => React.createRef()));
  const router = useRouter();

  const handleSubmit = async (pins: string[], refs: any) => {
    const pinNumber = pins.join('');
    // console.log('입력된 핀 넘버:', pinNumber);
    if(pinNumber.length !== 4) return;

    if(pinNumber === '5402') {
      router.push('/admin');
      return;
    }
    
    await signIn("credentials", {
      password: pinNumber,
      redirect: false
    }).then((result)=>{
      // console.log('credential result', JSON.stringify(result))
      if(result?.ok){
        router.push('/main')
      } else {
        // TODO. 로그인 실패 처리 
        alert('올바른 번호를 입력하세요!')
        setPins(['', '', '', ''])
        refs.current[0].current?.focus();
        // router.push('/')
      }
    });
    
  }

  const handleKeyDown = (index: number, event: any, refs: any) => {
    
    let newPins = [...pins];

    if (event.key === 'Backspace' && index > 0 ) {
      newPins[index] = '';
      setPins(newPins);
      if (index > 0) refs.current[index - 1].current?.focus();
    }
  };


  const handleChange = async (index: number, value: string, refs: any) => {
    let newPins: string[] = [];
    // 입력값이 숫자이고, 4자리인지 확인
    if (/^\d*$/.test(refs.current[index].current?.value) && value.length <= 1) {
      newPins = [...pins];
      newPins[index] = value;
      setPins(newPins);
      // console.log('newPins', JSON.stringify(newPins));
    }

    // 입력값이 변경될 때 해당 입력란으로 포커스 이동
    if (/^\d+$/.test(value) && (index < (refs.current.length - 1))) {
      refs.current[index + 1].current?.focus();
    }

    await handleSubmit(newPins, refs);
  };
  
    return (
      <main className='flex min-h-screen flex-col items-center space-y-12 p-24' style={{ backgroundImage: 'url("/wavemaker.png")', backgroundSize: 'cover' }}>

        <p className="mt-4 text-center text-6xl font-bold" style={{color: '#0C3659'}}>Wave</p>
        <p className="text-center text-6xl font-bold" style={{color: '#0C3659', marginTop: '10%'}}>Maker</p>

        <p className="mt-2 text-center text-lg text-gray-600" style={{color: '#0C3659', marginTop: '5%'}}>Break Time</p>

        <div>
          <div style={{ display: 'flex', marginBottom: '10px' }}>
              {pins.map((pin, index) => (
                <input
                  key={index}
                  type="number"
                  pattern="[0-9]*"
                  inputMode="numeric"
                  value={pin}
                  onChange={(e) => handleChange(index, e.target.value, inputRefs)}
                  onKeyDown={(e) => handleKeyDown(index, e, inputRefs)}
                  maxLength={1}
                  ref={inputRefs.current[index]}
                  className="w-14 text-center text-lg font-semibold border rounded-md p-2 bg-gray-400"
                  style={{
                    width: '60px', // 각 입력란의 너비 조절
                    height: '60px', // 각 입력란의 너비 조절
                    marginRight: '10px', // 입력란 간의 간격 조절
                    marginLeft: '10px', // 입력란 간의 간격 조절
                    border: '2px solid #ccc',
                    textAlign: 'center',
                    color: 'black', // 텍스트 색상을 빨간색으로 지정
                    fontSizeAdjust: 'inherit'
                  }}
                />
                
              ))}
            </div>
        </div>
      </main>
    )
  }
  
