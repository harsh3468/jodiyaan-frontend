import type { Metadata } from "next";
import { EditProfileView } from "./edit-profile-view";

export const metadata: Metadata = { title: "Edit profile" };

export default function EditProfilePage() {
  return <EditProfileView />;
}
