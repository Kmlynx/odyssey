import type { Route } from "./+types/home";
import OdysseyMap from "~/components/odyssey-map/odyssey-map";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Chart of the Odyssey" },
    {
      name: "description",
      content: "A horizontal scroll journey map of Odysseus's epic voyage from Troy to Ithaca.",
    },
  ];
}

export default function Home() {
  return <OdysseyMap />;
}
