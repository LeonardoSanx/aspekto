import Background from "./background";
import Card from "./card";
import Code from "./code";

export default function CodeNav({
  from,
  to,
  cardContent,
  background,
  codeContent,
  navContent,
}) {
  return (
    <div className="grid Grid_codeLayout lg:Grid_codeLayout-lg duration-1000 ease-in-out">
      <Background from={from} to={to} />
      <Card>{cardContent}</Card>
      <Code
        background={background}
        codeContent={codeContent}
        navContent={navContent}
      />
    </div>
  );
}
