import Card from "./Card";

type PlaceholderProps = {
  flex?: number | string;
};

export default function Placeholder({ flex }: PlaceholderProps) {
  return (
    <Card label="placeholder" flex={flex}>
      <div className="placeholder-content">
        <h1>placeholder</h1>
      </div>
    </Card>
  );
}