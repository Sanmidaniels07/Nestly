export interface SuggestedUser {
  id: string;
  name: string;
  username: string;
  bio: string;
  avatar: string;
  followers: number;
  isFollowing: boolean;
}

export const suggestedUsers: SuggestedUser[] =
  [
    {
      id: "1",
      name: "Sarah Johnson",
      username: "@sarahj",
      bio: "Frontend Engineer • Lagos",
      followers: 2300,
      avatar:
        "https://i.pravatar.cc/150?img=32",
      isFollowing: false,
    },
    {
      id: "2",
      name: "David James",
      username: "@davidj",
      bio: "Product Designer • Abuja",
      followers: 1800,
      avatar:
        "https://i.pravatar.cc/150?img=12",
      isFollowing: true,
    },
    {
      id: "3",
      name: "Grace Williams",
      username: "@gracew",
      bio: "Software Engineer • Ibadan",
      followers: 3400,
      avatar:
        "https://i.pravatar.cc/150?img=25",
      isFollowing: false,
    },
    {
      id: "4",
      name: "Michael Scott",
      username: "@michael",
      bio: "UI Designer • Port Harcourt",
      followers: 1200,
      avatar:
        "https://i.pravatar.cc/150?img=45",
      isFollowing: true,
    },
  ];