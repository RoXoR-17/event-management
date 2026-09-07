import Link from "next/link";

export default async function ErrorPage() {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100%",
        width: "100%",
      }}
    >
      <p style={{ marginBottom: "1rem" }}>Sorry, something went wrong</p>
      <Link href="/">Try Again</Link>
    </div>
  );
}
