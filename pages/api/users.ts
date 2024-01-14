// pages/api/users.js
import fs from 'fs/promises';
import path from 'path';

export default async function handler(req: any, res: any) {
  if (req.method === 'GET') {
    // GET 요청 처리
    const usersFilePath = path.join(process.cwd(), 'data', 'users.json');
    const usersData = await fs.readFile(usersFilePath, 'utf-8');
    const users = JSON.parse(usersData);

    res.status(200).json({ users });
  } else if (req.method === 'POST') {
    // POST 요청 처리
    const { endpoint } = req.body;

    if (endpoint === 'add') {
        const { userId } = req.body;
        console.log('userId',userId)
        // API 1에 대한 처리
        const usersFilePath = path.join(process.cwd(), 'data', 'users.json');
        const usersData = await fs.readFile(usersFilePath, 'utf-8');
        const users = JSON.parse(usersData);

        const userIndex = users.findIndex((user: any) => user.id == userId);
        console.log('userIndex',JSON.stringify(userIndex))
        // userId와 같은 id를 가진 데이터가 있다면 수정
        if (userIndex !== -1) {
            console.log('users[userIndex]',JSON.stringify(users[userIndex]))
            // 예시: 해당 사용자의 이름을 변경
            users[userIndex].count = users[userIndex].count + 1;
        }
        console.log('users',JSON.stringify(users))
        // 수정된 데이터를 다시 파일에 쓰기
        await fs.writeFile(usersFilePath, JSON.stringify(users, null, 2), 'utf-8');
        res.status(200).json({ message: 'API 1: ADD 성공' });

    } else if (endpoint === 'remove') {
        const { userId } = req.body;
        console.log('userId',userId)
        // API 1에 대한 처리
        const usersFilePath = path.join(process.cwd(), 'data', 'users.json');
        const usersData = await fs.readFile(usersFilePath, 'utf-8');
        const users = JSON.parse(usersData);

        const userIndex = users.findIndex((user: any) => user.id == userId);
        console.log('userIndex',JSON.stringify(userIndex))
        // userId와 같은 id를 가진 데이터가 있다면 수정
        if (userIndex !== -1) {
            console.log('users[userIndex]',JSON.stringify(users[userIndex]))
            // 예시: 해당 사용자의 이름을 변경
            users[userIndex].count = users[userIndex].count - 1;
        }
        console.log('users',JSON.stringify(users))
        // 수정된 데이터를 다시 파일에 쓰기
        await fs.writeFile(usersFilePath, JSON.stringify(users, null, 2), 'utf-8');
        res.status(200).json({ message: 'API 2: REMOVE 성공' });
    } else if (endpoint === 'api3') {
      // API 3에 대한 처리
      res.status(200).json({ message: 'API 3: POST 요청 성공' });
    } else {
      res.status(400).json({ message: '올바르지 않은 엔드포인트' });
    }
  } else {
    res.status(405).end(); // Method Not Allowed
  }
}
