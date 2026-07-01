import Card from "../ui/card";

interface Props {
  title: string;
  children: React.ReactNode;
}

export default function AuthCard({
  title,
  children,
}: Props) {
  return (
    <Card className="w-full max-w-md">
      <h1 className="mb-8 text-center text-3xl font-bold">
        {title}
      </h1>

      {children}
    </Card>
  );
}