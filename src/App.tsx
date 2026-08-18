import { useAuth } from "./features/auth/useAuth";

function App() {
  const { user, status, login, logout } = useAuth();

  async function handleLogin() {
    try {
      await login({
        email: "angelo@example.com",
        password: "Password123!",
      });

      console.log("Login successful");
    } catch (error) {
      console.error("Login failed:", error);
    }
  }

  async function handleLogout() {
    try {
      await logout();

      console.log("Logout successful");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4">
      <h1 className="text-3xl font-bold">ShopKB Authentication Test</h1>

      <p>
        Status: <strong>{status}</strong>
      </p>

      {user && (
        <div>
          <p>Name: {user.fullName}</p>
          <p>Email: {user.email}</p>
          <p>Role: {user.role}</p>
        </div>
      )}

      <div className="flex gap-3">
        <button
          onClick={handleLogin}
          className="rounded bg-black px-4 py-2 text-white"
        >
          Login
        </button>

        <button onClick={handleLogout} className="rounded border px-4 py-2">
          Logout
        </button>
      </div>
    </div>
  );
}

export default App;
