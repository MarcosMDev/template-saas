import { handleAuth } from "@/app/actions/handle-auth"
import { auth } from "@/app/lib/auth"
import Link from "next/link"
import { redirect } from "next/navigation"

export default async function Dashboard() {
  const session = await auth()

  if (!session) {
    redirect("/login")
  }

  return (
    <div className="flex flex-col gap-10 items-center justify-center h-screen">
      <h1 className="text-4xl font-bold">Protected Dashboard</h1>
      <p className="mt-4 text-lg">Welcome to your dashboard!</p>
      <p className="mt-2 text-lg">
        {session?.user?.email ? `Logged in as ${session.user.email}` : "Not logged in"}
      </p>
      {
        session.user?.email && (
          <form action={handleAuth}>
            <button
              className="border rounded-md p-2 cursor-pointer"
              type="submit"
            >
              Logout
            </button>
          </form>
        )
      }
      <Link href="/payments">
        <button className="border rounded-md p-2 cursor-pointer">
          Go to Payments
        </button>
      </Link>
    </div>
  )
}