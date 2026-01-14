import Header from "./Section/Header";
import GridManager from "./components/GridManager";

const Home = () => {
  return (
    <main className="w-full flex flex-col items-center min-h-screen p-16 gap-8">
      <Header />
      <GridManager />
    </main>
  );
}

export default Home;
