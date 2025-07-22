export default function Home() {
  return (
    <main className="flex items-center justify-center min-h-screen">
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-bold">Selamat Datang di Todo App</h1>
        <p className="text-gray-600">
          Silakan login atau register untuk mulai menggunakan
        </p>
        <div className="space-x-4">
          <a href="/auth/login" className="text-blue-500 underline">
            Login
          </a>
          <a href="/auth/register" className="text-blue-500 underline">
            Register
          </a>
        </div>
      </div>
    </main>
  );
}
