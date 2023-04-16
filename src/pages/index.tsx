import useCommunityData from "@/hooks/useCommunityData";

export default function Home() {
  useCommunityData();

  return <h1>Hello</h1>;
}
