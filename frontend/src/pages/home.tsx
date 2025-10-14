import { Sidebar } from '../components/sidebar';
export function Home() {
  return (
    <div className="flex">
      <Sidebar />
      <main className="flex-1 p-6">
        <h1 className="text-2xl font-bold">Home Page</h1>
      </main>
    </div>
  );
}