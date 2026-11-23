import "bootstrap/dist/css/bootstrap.min.css";

import Counter from "./components/Counter";
{{PING_IMPORT}}

function App() {
  return (
    <main className="app-shell position-relative d-flex align-items-center justify-content-center overflow-hidden min-vh-100">
      <div className="background-glow glow-top" />
      <div className="background-glow glow-right" />
      <div className="background-glow glow-bottom" />

      <section className="welcome-container position-relative w-100 text-center">
        <header className="d-flex justify-content-center mb-5">
          <img
            src="/origo-logo.svg"
            alt="Origo"
            className="origo-logo img-fluid"
          />
        </header>

        <section className="hero">
          <h1 className="display-1 fw-extrabold hero-title">
            {{HEADLINE_PREFIX}}{" "}
            <span className="hero-accent">React</span>
          </h1>

          <p className="lead subtitle mt-3">
            A modern starter template, out of the box.
          </p>
        </section>

        <section className="mt-4">
          <div className="d-flex flex-wrap align-items-center justify-content-center gap-3">
            <Counter />
            {{PING_BUTTON}}
          </div>

          <p className="instruction mt-4 fs-5">
            Edit <code className="instruction-code">{{APP_FILE}}</code> and save
            to test HMR
          </p>
        </section>

        <footer className="footer d-flex align-items-center justify-content-center gap-4 mt-5">
          <span className="footer-line" />

          <p className="d-flex align-items-center justify-content-center mb-0">
            Crafted with
            <span className="heart mx-3">♥</span>
            by <strong className="fw-semibold">Origo</strong>
          </p>

          <span className="footer-line" />
        </footer>
      </section>
    </main>
  );
}

export default App;
