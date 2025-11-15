export interface ResponseRefreshTokenResponse {
  accessToken: string;
}

export interface UserProfile {
  profileImageUrl: string;
  nickname: string;
  totalPoints: number;
  walkingCount: number;
}

export interface UserRanking {
  nickname: string;
  point: number | string;
  profileImageUrl: string;
  ranking: number | string;
}

export type UserProfileRequest = {
  nickname: string;
  profileImageUrl: string;
};

export type UserProfileResponse = {
  profileImageUrl: string;
  nickname: string;
  email: string;
  createdAt: string;
  totalPoints: number;
  walkingCount: number;
  role: string;
};

export type UserRankingItem = {
  nickname: string;
  point: number | string;
  profileImageUrl: string;
  ranking: number | string;
};

export type UserRankingResponse = UserRankingItem | null;

export interface CheckNicknameResponse {
  nickname: string;
  isAvailable: boolean;
}
