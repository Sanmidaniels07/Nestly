import Spinner from "../components/ui/loader";


export default function Loading() {
  return (
    <div className="flex h-[60vh] items-center justify-center">
      <Spinner size={32} />
    </div>
  );
}