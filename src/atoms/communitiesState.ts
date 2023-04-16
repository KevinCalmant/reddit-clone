import { CommunityType } from "@/types/CommunityType";
import { Timestamp } from "@firebase/firestore";
import { atom } from "recoil";

export interface Community {
  id: string;
  creatorId: string;
  numberOfMembers: number;
  privacyType: CommunityType;
  createdAt?: Timestamp;
  imageUrl?: string;
}

export interface CommunitySnippet {
  communityId: string;
  isModerator?: boolean;
  imageUrl?: string;
}

interface CommunityState {
  mySnippets: CommunitySnippet[];
  currentCommunity: Community | undefined;
  snippetFetched: boolean;
}

const defaultCommunityState: CommunityState = {
  mySnippets: [],
  currentCommunity: undefined,
  snippetFetched: false,
};

export const communityState = atom<CommunityState>({
  key: "communitiesState",
  default: defaultCommunityState,
});
