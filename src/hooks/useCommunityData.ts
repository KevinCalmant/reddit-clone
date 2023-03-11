import { useRecoilState, useSetRecoilState } from "recoil";
import {
  Community,
  CommunitySnippet,
  communityState,
} from "@/atoms/communitiesState";
import { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, firestore } from "@/firebase/clientApp";
import {
  collection,
  doc,
  getDocs,
  increment,
  writeBatch,
} from "@firebase/firestore";
import { authModalState } from "@/atoms/authModalState";

const useCommunityData = () => {
  const [user] = useAuthState(auth);
  const setAuthModalState = useSetRecoilState(authModalState);
  const [communityStateValue, setCommunityStateValue] =
    useRecoilState(communityState);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const joinCommunity = async (community: Community) => {
    try {
      setLoading(true);
      const batch = writeBatch(firestore);
      const snippet: CommunitySnippet = {
        communityId: community.id,
        imageUrl: community.imageUrl || "",
      };
      batch.set(
        doc(firestore, `users/${user?.uid}/communitySnippets`, community.id),
        snippet
      );
      batch.update(doc(firestore, "communities", community.id), {
        numberOfMembers: increment(1),
      });
      await batch.commit();
      setCommunityStateValue((prev) => ({
        ...prev,
        mySnippets: [...prev.mySnippets, snippet],
      }));
    } catch (error) {
      setErrorMessage(error.message);
    } finally {
      setLoading(false);
    }
  };

  const leaveCommunity = async (communityId: string) => {
    try {
      setLoading(true);
      const batch = writeBatch(firestore);
      batch.delete(
        doc(firestore, `users/${user?.uid}/communitySnippets`, communityId)
      );
      batch.update(doc(firestore, "communities", communityId), {
        numberOfMembers: increment(-1),
      });
      await batch.commit();
      setCommunityStateValue((prev) => ({
        ...prev,
        mySnippets: prev.mySnippets.filter(
          (snippet) => snippet.communityId !== communityId
        ),
      }));
    } catch (error) {
      setErrorMessage(error.message);
    } finally {
      setLoading(false);
    }
  };

  const onJoinOrLeaveCommunity = async (
    community: Community,
    isJoined: boolean
  ) => {
    if (!user) {
      setAuthModalState({
        open: true,
        view: "login",
      });
      return;
    }
    if (isJoined) {
      await leaveCommunity(community.id);
      return;
    }
    await joinCommunity(community);
  };

  const getMySnippets = async () => {
    try {
      setLoading(true);
      const snippetDocs = await getDocs(
        collection(firestore, `users/${user?.uid}/communitySnippets`)
      );
      const snippets = snippetDocs.docs.map((snippetDoc) => ({
        ...snippetDoc.data(),
      }));
      setCommunityStateValue((prev) => ({
        ...prev,
        mySnippets: snippets as CommunitySnippet[],
      }));
    } catch (error) {
      setErrorMessage(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!user) return;
    getMySnippets();
  }, [user]);

  return {
    communityStateValue,
    onJoinOrLeaveCommunity,
    loading,
    error: errorMessage,
  };
};

export default useCommunityData;
