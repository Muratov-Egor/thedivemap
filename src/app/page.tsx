import Header from '@/components/Header/Header';

export default function HomePage() {
  return (
    <main className="h-screen w-full flex flex-col">
      <Header />
      <div className="flex-1 ">
        <h1 className="text-3xl font-bold">The Dive Map</h1>
      </div>
    </main>
  );
}
