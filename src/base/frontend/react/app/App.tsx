import Counter from "./components/Counter";
{{PING_IMPORT}}

import "./App.css";

function App() {
  return (
    <main className="app">
      <div className="background-glow glow-top" />
      <div className="background-glow glow-right" />
      <div className="background-glow glow-bottom" />

      <section className="welcome-container">
        <header className="brand">
          <img
            src="/origo-logo.svg"
            alt="Origo"
            className="origo-logo"
          />
        </header>

        <section className="hero">
          <h1>
            {{HEADLINE_PREFIX}} <span>React</span>
          </h1>

          <p className="subtitle">
            A modern starter template, out of the box.
          </p>
        </section>

        <section className="counter-section">
          <div className="api-actions">
            <Counter />
            {{PING_BUTTON}}
          </div>

          <p className="instruction">
            Edit <code>{{APP_FILE}}</code> and save to test HMR
          </p>
        </section>

        <footer className="footer">
          <span className="footer-line" />

          <p>
            Crafted with
            <span className="heart">♥</span>
            by <strong>Origo</strong>
          </p>

          <span className="footer-line" />
        </footer>
      </section>
    </main>
  );
}

export default App;
