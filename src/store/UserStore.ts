import { create } from "zustand";
import { persist } from "zustand/middleware";

import type {
  UserProfile,
  UserProfileRequest,
  UserRanking,
} from "../types/user";
import {
  getUserProfile,
  getUserRanking,
  updateUserProfile,
} from "../apis/user";

interface UserStore {
  profile: UserProfile | null;
  ranking: UserRanking | null;
  error: string | null;

  fetchProfile: () => Promise<void>;
  fetchRanking: (weekDate: string) => Promise<void>;
  updateProfile: (data: Partial<UserProfileRequest>) => Promise<void>;

  displayNickname: () => string;
  displayProfileImage: () => string;
  displayPoint: () => string | number;
  displayRanking: () => string | number;
}

export const useUserStore = create<UserStore>()(
  persist(
    (set, get) => ({
      profile: null,
      ranking: null,
      error: null,

      fetchProfile: async () => {
        try {
          const data = await getUserProfile();

          set({
            profile: {
              ...data,
            },
            error: null,
          });
        } catch (err) {
          console.error("Failed to fetch profile", err);
          set({ profile: null, error: "프로필 정보를 불러오지 못했습니다." });
        }
      },

      fetchRanking: async (weekDate: string) => {
        try {
          const data = await getUserRanking(weekDate);
          const profile = get().profile;

          set({
            ranking: data
              ? { ...data }
              : profile
                ? {
                    nickname: profile.nickname,
                    profileImageUrl: profile.profileImageUrl,
                    point: "-",
                    ranking: "-",
                  }
                : null,
            error: null,
          });
        } catch (err) {
          console.error("Failed to fetch ranking", err);
          set({ ranking: null, error: "랭킹 정보를 불러오지 못했습니다." });
        }
      },

      updateProfile: async (data: Partial<UserProfileRequest>) => {
        const profile = get().profile;
        if (!profile)
          throw new Error("프로필 정보가 아직 로드되지 않았습니다.");

        try {
          const response = await updateUserProfile({
            nickname: data.nickname ?? profile.nickname,
            profileImageUrl: data.profileImageUrl ?? profile.profileImageUrl,
          });

          const updated = response;
          set({
            profile: {
              ...profile,
              nickname: updated.nickname,
              profileImageUrl: updated.profileImageUrl,
            },
            error: null,
          });
        } catch (err) {
          console.error("Failed to update profile", err);
          set({ error: "프로필 업데이트에 실패했습니다." });
        }
      },

      displayNickname: () => get().profile?.nickname ?? "",
      displayProfileImage: () =>
        get().profile?.profileImageUrl ?? "/default.png",
      displayPoint: () => get().ranking?.point?.toLocaleString() ?? "-",
      displayRanking: () => get().ranking?.ranking ?? "-",
    }),
    {
      name: "user-store",
      partialize: (state) => ({
        profile: state.profile,
        ranking: state.ranking,
      }),
    }
  )
);
