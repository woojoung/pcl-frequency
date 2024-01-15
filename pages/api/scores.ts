// pages/api/scores.js
import fs from "fs/promises";
import path from "path";

export default async function handler(req: any, res: any) {
  if (req.method === "GET") {
    // GET 요청 처리
    const scoresFilePath = path.join(process.cwd(), "data", "scores.json");
    const scoresData = await fs.readFile(scoresFilePath, "utf-8");
    const scores = JSON.parse(scoresData);

    return res.status(200).json({ scores });
  } else if (req.method === "POST") {
    // POST 요청 처리
    const { endpoint } = req.body;

    if (endpoint === "register") {
      const { userId, roundId, roundScore } = req.body;
      console.log("userId", userId);
      // max roundScore = 3
      if (roundScore > 3 || roundScore < 0) {
        res.status(400).json({
          message: `올바르지 않은 score: ${roundScore.toString()} 입니다.`,
        });
      }

      // API 1에 대한 처리
      const scoresFilePath = path.join(process.cwd(), "data", "scores.json");
      const scoresData = await fs.readFile(scoresFilePath, "utf-8");
      const scores = JSON.parse(scoresData);

      const scoreIndex = scores.findIndex((score: any) => score.id == userId);
      // console.log("scoreIndex", JSON.stringify(scoreIndex));
      // userId와 같은 id를 가진 데이터가 있다면 수정
      if (scoreIndex !== -1) {
        console.log("scores[scoreIndex]", JSON.stringify(scores[scoreIndex]));
        console.log("scores[scoreIndex] roundId", JSON.stringify(roundId));
        // 예시: 해당 사용자의 이름을 변경
        scores[scoreIndex][roundId] = roundScore;
      }
      // console.log("scores", JSON.stringify(scores));
      // 수정된 데이터를 다시 파일에 쓰기
      await fs.writeFile(
        scoresFilePath,
        JSON.stringify(scores, null, 2),
        "utf-8"
      );
      return res.status(200).json({ message: "API 1: Register 성공" });
    } else if (endpoint === "remove") {
      const { userId, roundId } = req.body;
      // console.log("userId", userId);
      // API 1에 대한 처리
      const scoresFilePath = path.join(process.cwd(), "data", "scores.json");
      const scoresData = await fs.readFile(scoresFilePath, "utf-8");
      const scores = JSON.parse(scoresData);

      const scoreIndex = scores.findIndex((score: any) => score.id == userId);
      // console.log("scoreIndex", JSON.stringify(scoreIndex));
      // userId와 같은 id를 가진 데이터가 있다면 수정
      if (scoreIndex !== -1) {
        console.log("scores[scoreIndex]", JSON.stringify(scores[scoreIndex]));
        // 예시: 해당 사용자의 이름을 변경
        scores[scoreIndex].count = scores[scoreIndex].count - 1;
      }
      // console.log("scores", JSON.stringify(scores));
      // 수정된 데이터를 다시 파일에 쓰기
      await fs.writeFile(
        scoresFilePath,
        JSON.stringify(scores, null, 2),
        "utf-8"
      );
      return res.status(200).json({ message: "API 2: REMOVE 성공" });
    } else if (endpoint === "api3") {
      // API 3에 대한 처리
      return res.status(200).json({ message: "API 3: POST 요청 성공" });
    } else {
      return res.status(400).json({ message: "올바르지 않은 엔드포인트" });
    }
  } else {
    return res.status(405).end(); // Method Not Allowed
  }
}
