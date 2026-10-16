import { SellerApplicationStatus } from "./seller";

export type DashboardRange = 7 | 30 | 90;

export interface DashboardActivityPoint {
  date: string;
  likes: number;
  views: number;
  followers: number;
}

export interface DashboardEvent {
  id: string;
  title: string;
  startAt: string;
  location: string | null;
  coverImage: string | null;
}

export interface DashboardBirthday {
  id: string;
  name: string;
  username: string | null;
  avatar: string | null;
  date: string;
  daysAway: number;
}

export interface UserDashboard {
  range: { days: number; since: string };
  social: {
    followers: number;
    following: number;
    posts: number;
    likesReceived: number;
    commentsReceived: number;
    profileViews: number;
    newFollowers: number;
    newLikes: number;
  };
  activity: DashboardActivityPoint[];
  shopping: {
    totalOrders: number;
    activeOrders: number;
    awaitingConfirmation: number;
    totalSpent: number;
    wishlistCount: number;
    cartItems: number;
  };
  community: {
    communitiesJoined: number;
    upcomingEvents: DashboardEvent[];
  };
  inbox: {
    unreadNotifications: number;
    unreadMessages: number;
  };
  upcomingBirthdays: DashboardBirthday[];
  seller: {
    status: SellerApplicationStatus;
    hasStore: boolean;
    store: { id: string; name: string; slug: string } | null;
  } | null;
}
