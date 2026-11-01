import type { Metadata } from "next";
import { MeView } from "./me-view";

export const metadata: Metadata = { title: "My profile" };

export default function MePage() {
  return <MeView />;
}
