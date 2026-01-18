export interface User {
  id: string; // 유저 ID
  nickname: string; // 유저 닉네임
  color: string; // 커서 색깔
}

// TODO: 유저 카드를 위한 타입 (추후 수정)
export interface UserExtended extends User {
  role: string;
  textColor: string;
  style: string;
  time: string;
  status: string;
  activity: number[];
}
