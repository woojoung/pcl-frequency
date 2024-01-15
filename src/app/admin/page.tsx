'use client'
import React, { useRef, useState, useEffect } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'

/**
 * v0 by Vercel.
 * @see https://v0.dev/t/1olEm3m7Bot
 */
export default function Component() {
  const [user, setUser] = useState('');
  const [round, setRoundId] = useState('');
  const [score, setRoundScore] = useState('');
  // const [users, setUsers] : any = useState([]);
  const [scores, setScores] : any = useState([]);

  // const fetchUsers = async () => {
  //   const response = await fetch('/api/users', { method:'GET' });
  //   console.log('fetchUsers response', response);
  //   const data = await response.json();
  //   console.log('fetchUsers response data', data);
  //   setUsers(data.users);
  // };

  const fetchScores = async () => {
    const response = await fetch('/api/scores', { method:'GET' });
    console.log('fetchScores response', response);
    const data = await response.json();
    console.log('fetchScores response data', data);
    setScores(data.scores);
  };

  useEffect(() => {
    // fetchUsers();
    fetchScores();
  }, [user]);

  const registerScore = async () => {
    const userId = user || 0;
    const roundId = `r${round}`;
    const roundScore = parseInt(score);
    const response = await fetch('/api/scores', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ endpoint: 'register', userId, roundId, roundScore }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const data = await response.json();
    console.log('API 응답 데이터:', data);
    setUser('');
    setRoundScore('');
    setRoundId('')
  }

  // const addStamp = async (e: any, roundId: string, roundScore: number) => {
  //   e.preventDefault();
  //   const userId = user || 0;
  //   const response = await fetch('/api/users', {
  //     method: 'POST',
  //     headers: {
  //       'Content-Type': 'application/json',
  //     },
  //     body: JSON.stringify({ endpoint: 'register', userId }),
  //   });

  //   if (!response.ok) {
  //     throw new Error(`HTTP error! Status: ${response.status}`);
  //   }
  //   const data = await response.json();
  //   console.log('API 응답 데이터:', data);
  //   setUser('');
  // }

  // const removeStamp = async (e: any) => {
  //   e.preventDefault();
  //   const userId = user || 0;
  //   const response = await fetch('/api/users', {
  //     method: 'POST',
  //     headers: {
  //       'Content-Type': 'application/json',
  //     },
  //     body: JSON.stringify({ endpoint: 'remove', userId }),
  //   });

  //   if (!response.ok) {
  //     throw new Error(`HTTP error! Status: ${response.status}`);
  //   }
  //   const data = await response.json();
  //   console.log('API 응답 데이터:', data);
  //   setUser('');
  // }

  return (
    <div className="bg-white p-4 rounded-lg shadow-md max-w-md mx-auto" style={{ backgroundImage: 'url("/login.png")', backgroundSize: 'cover' }}>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-lg font-semibold" style={{color: '#0C3659'}}>Wave Maker Frequency</h1>
        <SettingsIcon className="text-gray-600" />
      </div>
      <div className="mb-2">
        <span className="text-sm font-medium" style={{color: '#0C3659'}}>Admin</span>
      </div>
      <div className="overflow-auto">
        <table className="min-w-full">
          <thead>
            <tr className="text-left text-xs font-medium text-gray-500">
              <th className="px-2 py-1"></th>
              <th className="px-2 py-1">R1</th>
              <th className="px-2 py-1">R2</th>
              <th className="px-2 py-1">R3</th>
              <th className="px-2 py-1">R4</th>
              <th className="px-2 py-1">R5</th>
              <th className="px-2 py-1">R6</th>
              <th className="px-2 py-1">Total</th>
            </tr>
          </thead>
          <tbody>
            {scores.map((score: any)=>{
                  return(<tr key={score.id} className="text-sm">
                      <td className="px-2 py-1" style={{color: '#0C3659'}}>{score.name}</td>
                      {
                        Object.keys(score)
                        .filter(key => key !== "id" && key !== "name")
                        .map((key)=> {
                          return (<td key={score.id} className="px-2 py-1">
                            <div className="w-6 h-6 text-center bg-gray-300">{score[key]}</div>
                          </td>) 
                        })
                        
                      }
                      <td className="px-2 py-1 text-center" style={{color: '#0C3659'}}>{
                        Object.keys(score)
                        .filter(key => key !== "id" && key !== "name")
                        .reduce((sum, key) => sum + score[key], 0)
                      }개</td>
                    </tr>);
              })}
          </tbody>
        </table>
        <br></br>
        <div className="flex space-x-4"> {/* 부모 요소에 flex 클래스와 간격을 주는 클래스를 추가 */}
        <input
          type="text"
          placeholder='조 번호'
          className="w-full text-center text-lg font-semibold border rounded-md p-2"
          maxLength={2}
          value={user}
          onChange={(e) => setUser(e.target.value)}
          style={{
            // width: '50px', // 각 입력란의 너비 조절
            marginRight: '10px', // 입력란 간의 간격 조절
            border: '1px solid #ccc',
            textAlign: 'center',
            color: 'black', // 텍스트 색상을 빨간색으로 지정
          }}
        />
        <input
          type="text"
          placeholder='게임 번호'
          className="w-full text-center text-lg font-semibold border rounded-md p-2"
          maxLength={1}
          value={round}
          onChange={(e) => setRoundId(e.target.value)}
          style={{
            // width: '50px', // 각 입력란의 너비 조절
            marginRight: '10px', // 입력란 간의 간격 조절
            border: '1px solid #ccc',
            textAlign: 'center',
            color: 'black', // 텍스트 색상을 빨간색으로 지정
          }}
        />
        <input
          type="text"
          placeholder='스탬프 수'
          className="w-full text-center text-lg font-semibold border rounded-md p-2"
          maxLength={1}
          value={score}
          onChange={(e) => setRoundScore(e.target.value)}
          style={{
            // width: '50px', // 각 입력란의 너비 조절
            marginRight: '10px', // 입력란 간의 간격 조절
            border: '1px solid #ccc',
            textAlign: 'center',
            color: 'black', // 텍스트 색상을 빨간색으로 지정
          }}
        />
          
        </div>

        <br></br>
        <br></br>

        <div className="flex space-x-4"> {/* 부모 요소에 flex 클래스와 간격을 주는 클래스를 추가 */}
          <button className="flex-1 h-20 bg-blue-500 text-white py-2 px-4 rounded" style={{backgroundColor: '#0C3659'}} onClick={registerScore}>저장하기</button>
          {/* <button className="flex-1 h-20 bg-red-500 text-white py-2 px-4 rounded" onClick={removeStamp}>스탬프 회수</button> */}
        </div>
        <br></br>
      </div>
    </div>
  )
}

function SettingsIcon(props: any) {
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
      <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  )
}
