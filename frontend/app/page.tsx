import HouseForm from "./components/HouseForm";

export default function Home() {
  return (
    <div className="w-full px-4 py-10 flex justify-center">
      <div className="max-w-3xl w-full">
        <HouseForm />
      </div>
    </div>
  );
}
