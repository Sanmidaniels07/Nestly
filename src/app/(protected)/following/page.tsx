import { redirect } from "next/navigation";

// Followers / following open as a list on the profile now (like Instagram),
// so old links and bookmarks land there.
export default function FollowingPage() {
  redirect("/profile?list=following");
}
