import Counter from "./components/Counter";
{{PING_IMPORT}}

function App() {
  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#030309] text-white">
      <div className="pointer-events-none absolute -left-[300px] -top-[470px] h-[650px] w-[650px] rounded-full border-2 border-[#7018ff]/75 shadow-[0_0_80px_rgba(104,0,255,0.2)]" />
      <div className="pointer-events-none absolute -right-[420px] top-[10%] h-[500px] w-[500px] rounded-full border-2 border-[#5d00dc]/20" />
      <div className="pointer-events-none absolute -bottom-[750px] -right-[300px] h-[850px] w-[850px] rounded-full border-2 border-[#7018ff]/75 shadow-[0_0_90px_rgba(104,0,255,0.25)]" />

      <section className="relative z-10 w-full max-w-[1500px] px-[7%] py-[90px] text-center">
        <header className="mb-12 flex justify-center">
          <img
            src="/origo-logo.svg"
            alt="Origo"
            className="h-auto w-[420px] max-w-[85%] object-contain"
          />
        </header>

        <section className="hero">
          <h1 className="text-[clamp(42px,5.5vw,82px)] font-extrabold tracking-[-3px]">
            {{HEADLINE_PREFIX}}{" "}
            <span className="bg-gradient-to-r from-[#9b42ff] via-[#6412ed] to-[#a65bff] bg-clip-text text-transparent">
              React
            </span>
          </h1>

          <p className="mt-3 text-[clamp(16px,2vw,30px)] text-[#b9b2d2]">
            A modern starter template, out of the box.
          </p>
        </section>

        <section className="mt-10">
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Counter />
            {{PING_BUTTON}}
          </div>

          <p className="mt-6 text-[21px] text-[#c4bed8]">
            Edit{" "}
            <code className="rounded-lg bg-[#7b30ff]/10 px-2.5 py-1.5 font-mono text-[#ad69ff]">
              {{APP_FILE}}
            </code>{" "}
            and save to test HMR
          </p>
        </section>

        <footer className="mt-[85px] flex items-center justify-center gap-[30px] text-[#c4bddb]">
          <span className="h-px w-[125px] bg-[#9b82c8]/30" />

          <p className="flex items-center justify-center text-[19px]">
            Crafted with
            <span className="mx-3.5 inline-block text-[27px] text-[#8d32ff]">
              ♥
            </span>
            by <strong className="font-semibold text-[#a34cff]">Origo</strong>
          </p>

          <span className="h-px w-[125px] bg-[#9b82c8]/30" />
        </footer>
      </section>
    </main>
  );
}

export default App;
