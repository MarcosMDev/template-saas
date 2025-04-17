import { handleAuth } from "@/app/actions/handle-auth";

export default function Login() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <h1 className="text-3xl font-bold">Login Page</h1>
      <form action={handleAuth}>
        <button
          className="border rounded-md p-2 cursor-pointer"
          type="submit"
        >
          Signin with Google
        </button>
      </form>
    </main>
  )
}