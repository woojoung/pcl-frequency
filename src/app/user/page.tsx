'use client'
import firestore from "../firebase/firestore";
import { doc, getDoc, getDocs, collection, where, query, getFirestore, addDoc } from 'firebase/firestore';
import React, { useState, useEffect } from 'react'

export default function Home() {

  const [value, setValue] = useState('');

  const [newUsers, setNewUsers] = useState([]);
  const [scores, setScores] = useState([]);

  const [users, setUsers] = useState([]);

  const fetchUsers = async () => {
    const response = await fetch('/api/users', {method:'GET'});
    console.log('response', response);
    const data = await response.json();
    console.log('data', data.users);
    setUsers(data.users);
  };

  const findUsers = async () => {
    const usersRef = query(collection(firestore, "users"), where("name", "==", "1조"))
    const usersSnapshot = await getDocs(usersRef)
    if (usersSnapshot.empty) {
      console.log("일치하는 user가 없습니다.");
      setNewUsers([]);
    } 
    const users: any = usersSnapshot.docs.map((doc) => doc.data());
    console.log('users: ', users);

    
    setNewUsers(users)
  };

  const findScores = async () => {
    const scoresRef = query(collection(firestore, "scores"), where("name", "==", "3조"))
    const scoresSnapshot = await getDocs(scoresRef)
    if (scoresSnapshot.empty) {
      console.log("일치하는 score가 없습니다.");
      setScores([]);
    } 
    const scores: any = scoresSnapshot.docs.map((doc) => doc.data());
    console.log('scores: ', scores)
    setScores(scores)
  };

  const onClickEventScore = async () => {
    [1,2,3,4,5,6,7,8,9,10,11,12].forEach(async (element: any) => {
      console.log('element: ', element);
      // // score 데이터 추가 (id는 자동 생성됨)
      // await addDoc(collection(firestore, "scores"), {
      //   name: `${element}조`,
      //   userId: element,
      //   round1: 0,
      //   round2: 0,
      //   round3: 0,
      //   round4: 0,
      //   round5: 0,
      //   round6: 0,
      // });
      // users 추가?
    });
  }

  const onClickEventUser = async () => {
    users.forEach(async (element: any) => {
      console.log('element: ', element);
      // user 데이터 추가 (id는 자동 생성됨)
      // await addDoc(collection(firestore, "users"), {
      //   id: element.id,
      //   name: element.name,
      //   password: element.password,
      //   count: element.count,
      //   round1: 0,
      //   round2: 0,
      //   round3: 0,
      //   round4: 0,
      //   round5: 0,
      //   round6: 0,
      // });
      
    });
  }

  useEffect(() => {
    findUsers();
    findScores();
    // fetchUsers();
  }, []);

  return (
    <div>
      <form onSubmit={(event) => event.preventDefault()}>
        <input onChange={(event) => setValue(event.target.value)} />
        <br></br>
        <button onClick={onClickEventScore}>score 생성</button>
        <br></br>
        <button onClick={onClickEventUser}>user 생성</button>
      </form>
    </div>
  )
}
