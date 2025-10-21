// lib/api.ts
// 실제 axios는 남겨두고, mock용 가짜 함수만 씁니다.
import axios from "axios";

// 필요하면 여전히 유지 가능
const api = axios.create({
  baseURL: "http://localhost:4000",
  withCredentials: true,
});

// ⚙️ 회원가입 (mock)
export const registerUser = async (data: { email: string; password: string; name: string }) => {
  console.log("🔹 Mock register request:", data);
  // 서버 없이 0.8초 후 성공 응답
  return new Promise((resolve) => {
    setTimeout(() => resolve({ message: "회원가입 성공" }), 800);
  });
};

// ⚙️ 로그인 (mock)
export const loginUser = async (data: { email: string; password: string }) => {
  console.log("🔹 Mock login request:", data);
  // 이메일·비밀번호 맞는지 검사하는 흉내
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (data.email && data.password) {
        resolve({ message: "로그인 성공", token: "fake-jwt-token" });
      } else {
        reject({ message: "입력값 누락" });
      }
    }, 800);
  });
};

export default api;
