"use client";

export default function RightSidebar() {
  return (
    <aside className="sticky top-0 hidden h-screen w-80 shrink-0 overflow-y-auto bg-slate-950 px-6 py-6 xl:block">
      <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5">
        <h2 className="text-lg font-bold text-white">What is happening</h2>

        <div className="mt-5 space-y-4">
          {["#Nextjs", "#FirebaseAuth", "#MongoDB", "#BuildInPublic"].map(
            (tag) => (
              <button
                key={tag}
                type="button"
                className="block w-full rounded-xl px-3 py-2 text-left text-sm font-medium text-slate-400 transition hover:bg-slate-800 hover:text-white"
              >
                {tag}
              </button>
            )
          )}
        </div>
      </div>
    </aside>
  );
}