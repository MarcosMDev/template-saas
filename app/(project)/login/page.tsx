import { handleAuth } from "@/app/actions/handle-auth";
import { auth } from "@/app/lib/auth";
import { redirect } from "next/navigation";

export default async function Login() {
  const session = await auth();

  if (session) {
    redirect("/dashboard");
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <h1 className="text-3xl font-bold">Login Page!</h1>
      <form action={handleAuth}>
        <button className="border rounded-md p-2 cursor-pointer" type="submit">
          Signin with Google
        </button>
      </form>
    </main>
  );
}
