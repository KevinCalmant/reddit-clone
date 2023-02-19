import Navbar from "@/components/Navbar/Navbar";

export default function Layout({ children }: { children: JSX.Element }) {
  return (
    <>
      <Navbar />
      <main>{children}</main>
    </>
  );
}
