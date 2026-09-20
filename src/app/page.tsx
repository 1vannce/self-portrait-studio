export default function Home() {
  return (
    <main className="flex flex-1 items-center justify-center bg-zinc-50 px-6 py-24 font-sans dark:bg-black">
      <section className="w-full max-w-2xl rounded-3xl border border-zinc-200 bg-white p-10 shadow-sm dark:border-zinc-800 dark:bg-zinc-950 sm:p-14">
        <p className="text-sm font-medium tracking-[0.2em] text-zinc-500 uppercase">
          Self Portrait Studio
        </p>
        <h1 className="mt-4 text-4xl font-semibold tracking-tight text-zinc-950 dark:text-zinc-50 sm:text-5xl">
          The studio is ready for its first portrait.
        </h1>
        <p className="mt-6 max-w-xl text-lg leading-8 text-zinc-600 dark:text-zinc-400">
          Next.js, Supabase, Drizzle, and external integration contracts are
          configured. Add your Supabase credentials to <code>.env.local</code>{" "}
          to begin building the creation flow.
        </p>
        <div className="mt-10 grid gap-3 text-sm text-zinc-600 dark:text-zinc-300 sm:grid-cols-2">
          <p className="rounded-xl bg-zinc-100 px-4 py-3 dark:bg-zinc-900">
            Auth and storage via Supabase
          </p>
          <p className="rounded-xl bg-zinc-100 px-4 py-3 dark:bg-zinc-900">
            Typed database access via Drizzle
          </p>
        </div>
      </section>
    </main>
  );
}
