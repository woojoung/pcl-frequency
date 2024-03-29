'use client'
import React, { useRef, useState, useEffect } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import firestore from "../firebase/firestore";
import { doc, getDoc, getDocs, collection, where, query, getFirestore, addDoc, orderBy,updateDoc } from 'firebase/firestore';

/**
 * v0 by Vercel.
 * @see https://v0.dev/t/1olEm3m7Bot
 */
export default function Component() {
  const [userId, setUserId] = useState('');
  const [roundId, setRoundId] = useState('');
  const [score, setRoundScore] = useState('');
  const [users, setUsers] : any = useState([]);
  // const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const findUsers = async () => {
    const usersRef = query(collection(firestore, "users"), orderBy("id", "asc"))
    const usersSnapshot = await getDocs(usersRef);
    const users: any = usersSnapshot.docs.map((doc) => doc.data());
    console.log('users: ', users);
    setUsers(users);
    // setLoading(false);
  };

  useEffect(() => {
    if (refreshing) {
      // Your refresh logic here
      findUsers();

      // Reset the refresh status after handling the refresh
      setRefreshing(false);
    }
  }, [refreshing]);

  // Function to trigger the refresh
  const handleRefresh = () => {
    setRefreshing(true);
  };

  useEffect(() => {
    findUsers();
  }, [userId]);

  const registerScore = async () => {
    console.log('registerScore');
    console.log('userId', userId);
    const amount = parseInt(score.trim());
    const roundNum = parseInt(roundId.trim());
    // validate
    if(roundNum > 12 || roundNum < 0 || isNaN(roundNum)) {
      alert("게임번호를 확인해주세요");
      return;
    }
    if(amount > 3 || amount < 0 || isNaN(amount)) {
      alert("프리퀀시를 확인해주세요 (0 < 프리퀀시 < 4)");
      return;
    }

    const usersRef = query(collection(firestore, "users"), where("id", "==", parseInt(userId.trim() ?? '0')));
    // 쿼리 실행
    const querySnapshot = await getDocs(usersRef);
    // 쿼리 결과 확인
    if (!querySnapshot.empty) {
      // 쿼리에 해당하는 문서가 존재할 경우
      querySnapshot.forEach(async (doc) => {
        const docRef = doc.ref;
        // 필드 업데이트
        await updateDoc(docRef, { [`round${roundId}`]: amount })
      });
    } else {
      alert("조 번호를 확인해주세요!")
    }
    setUserId('');
    setRoundScore('');
    setRoundId('')
  }

  return (
    <div className="bg-white p-4 rounded-lg shadow-md max-w-md mx-auto" style={{ backgroundSize: 'cover' }}>
      {/* {loading && (<LoadingSpinner />)} */}
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-lg font-semibold" style={{color: '#0C3659'}}>Wave Maker Frequency</h1>
        {/* <SettingsIcon className="text-gray-600" /> */}
        <RefreshIcon className="text-gray-600 hover:bg-sky-300 hover:rounded" onClick={handleRefresh}/>
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
            {users.map((user: any)=>{
                  return(<tr key={user.id} className="text-sm">
                      <td className="px-2 py-1" style={{color: '#0C3659'}}>{user.name}</td>
                      {
                        Object.keys(user)
                        .filter(key => key !== "id" && key !== "name" && key !== "password" && key !== "count")
                        .sort()
                        .map((key)=> {
                          return (<td key={user.id} className="px-2 py-1">
                            <div className="w-6 h-6 text-center bg-gray-300" style={{color: '#0C3659'}}>{user[key]}</div>
                          </td>) 
                        })
                        
                      }
                      <td className="px-2 py-1 text-center" style={{color: '#0C3659'}}>{
                        Object.keys(user)
                        .filter(key => key !== "id" && key !== "name" && key !== "password" && key !== "count")
                        .reduce((sum, key) => sum + user[key], 0)
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
          pattern="\d*"
          maxLength={2}
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
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
          pattern="\d*"
          maxLength={1}
          value={roundId}
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
          placeholder='프리퀀시 수'
          className="w-full text-center text-lg font-semibold border rounded-md p-2"
          pattern="\d*"
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
          <button className="flex-1 h-20 bg-blue-500 text-white py-2 px-4 rounded" style={{backgroundColor: '#0C3659'}} onPointerDown={registerScore}>저장하기</button>
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

function RefreshIcon({ color, ...props }: any) {
  return (
    <button className="flex items-center px-2 py-3 font-medium tracking-wide text-white capitalize transition-colors duration-300 transform bg-sky-600 rounded-lg hover:bg-sky-500 focus:outline-none focus:ring focus:ring-sky-300 focus:ring-opacity-80">
      <svg className="w-5 h-5 mx-0" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
      </svg>

      <span className="mx-1">Refresh</span>
    </button>
  );
}

// function LoadingSpinner({ color, ...props }: any) {
//   return (
//     <div className="relative bg-white bg-opacity-60 z-10 h-full w-full flex items-center justify-center">
//     <div className="flex items-center">
//       <span className="text-3xl mr-4 text-gray-800">Loading</span>
//       <svg className="animate-spin h-8 w-8 text-gray-800" xmlns="http://www.w3.org/2000/svg" fill="none"
//         viewBox="0 0 24 24">
//         <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
//         <path className="opacity-75" fill="currentColor"
//           d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
//         </path>
//       </svg>
//     </div>
//   </div>
//   )
// }
