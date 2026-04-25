import { Component } from "react";

export default class AppErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    if (!this.state.hasError) return this.props.children;

    return (
      <main className="min-h-screen bg-dark-bg p-6 text-white">
        <section className="mx-auto mt-16 max-w-lg glass-card p-6">
          <h1 className="text-2xl font-bold gradient-text">
            Something went wrong
          </h1>
          <p className="mt-3 text-gray-300">
            Refresh the page. If this keeps happening, clear the saved login and
            sign in again.
          </p>
          <button
            className="mt-5 rounded-full bg-gradient-to-r from-neon-blue to-neon-purple px-5 py-2 font-semibold"
            onClick={() => {
              localStorage.removeItem("token");
              localStorage.removeItem("user");
              window.location.assign("/login");
            }}
          >
            Reset login
          </button>
        </section>
      </main>
    );
  }
}
