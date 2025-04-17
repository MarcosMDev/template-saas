import Link from "next/link"

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <h1 className="text-3xl font-bold">Landing Page</h1>
      <Link href="/login">
        <button>
          Login
        </button>
      </Link>
    </main>
  )
}
