import type { Metadata } from "next";

import GuideDocument, { GuidePart } from "@/src/components/guides/guide-document";
import { MIN_AGE } from "@/src/lib/legal";
import { OG_IMAGE } from "@/src/lib/site";

export const metadata: Metadata = {
  title: "Community guide - get started on Nestly",
  description:
    "Step by step: create your profile, follow people, post and share stories, message, join communities and events, celebrate birthdays and stay safe on Nestly.",
  alternates: { canonical: "/guides/community" },
  openGraph: { title: "Getting started on Nestly", url: "/guides/community", images: [OG_IMAGE] },
};

const parts: GuidePart[] = [
  {
    heading: "Get started",
    steps: [
      {
        id: "account",
        title: "Create your account",
        where: { label: "nestlyapp.site/signup", href: "/signup" },
        body: (
          <p>
            Sign up with your name, email and a password and verify your email. Add your birthday if you like - your followers will be reminded to
            celebrate you, and only the day is shared, never your age. You must be at least {MIN_AGE}.
          </p>
        ),
      },
      {
        id: "profile",
        title: "Make your profile yours",
        where: { label: "Settings → Profile", href: "/settings/profile" },
        body: (
          <p>
            Pick a <strong>username</strong>, add a profile photo and cover, a short bio, your location and work, and the things you&apos;re into.
            You can link your other social profiles too.
          </p>
        ),
      },
      {
        id: "follow",
        title: "Follow people you know",
        body: (
          <p>
            Search for friends, family and creators and tap <strong>Follow</strong>. Their posts and stories fill your feed. See who you follow and who
            follows you under <strong>Following</strong> and <strong>Followers</strong>.
          </p>
        ),
      },
    ],
  },
  {
    heading: "Share and connect",
    steps: [
      {
        id: "post",
        title: "Post to your feed",
        where: { label: "Feed → What's happening today?", href: "/feed" },
        body: (
          <p>
            Write up to 2,000 characters, add up to 10 photos or videos, and use <strong>#hashtags</strong> so people can find your post - tap any
            hashtag to see every post that uses it. You can edit or delete your posts any time.
          </p>
        ),
        tip: "Sellers can tag a product from their store in a post, so followers can buy it in one tap.",
      },
      {
        id: "stories",
        title: "Share a story",
        body: <p>Stories disappear after 24 hours. Friends can react with an emoji, and you can see who viewed yours.</p>,
      },
      {
        id: "engage",
        title: "Like and comment",
        body: <p>Show some love on posts you enjoy - like them and join the conversation in the comments.</p>,
      },
      {
        id: "messages",
        title: "Send messages",
        where: { label: "Messages", href: "/messages" },
        body: (
          <p>
            Chat privately and see when people are online or typing. Share photos and videos, reply to a specific message, react with an emoji
            (on a computer, double-click a message to ❤️ it), or delete a message for everyone. Long-press a message on your phone for these options.
          </p>
        ),
      },
      {
        id: "communities",
        title: "Join or start a community",
        where: { label: "Communities → Create community", href: "/communities" },
        body: (
          <p>
            Find groups around your interests, church, school, estate or business and tap <strong>Join</strong>. Or start your own with a name,
            description and icon - you can make members admins to help you run it.
          </p>
        ),
      },
      {
        id: "events",
        title: "Discover and host events",
        where: { label: "Events → Create event", href: "/events" },
        body: (
          <p>
            RSVP <strong>Going</strong> or <strong>Interested</strong> to events and chat in their comments. Hosting? Create an event with a title,
            date and time, location and cover image.
          </p>
        ),
      },
      {
        id: "birthdays",
        title: "Never miss a birthday",
        body: (
          <p>
            On someone&apos;s birthday, Nestly reminds their followers so you can send your wishes - and your followers will be reminded of yours.
          </p>
        ),
      },
    ],
  },
  {
    heading: "Stay safe and in control",
    steps: [
      {
        id: "notifications",
        title: "Choose your notifications",
        where: { label: "Settings → Notifications", href: "/settings/notifications" },
        body: <p>Turn notifications on or off for likes, comments, new followers, messages, marketplace orders and announcements.</p>,
      },
      {
        id: "security",
        title: "Secure your account",
        where: { label: "Settings → Security", href: "/settings/security" },
        body: (
          <p>
            Turn on <strong>two-factor authentication</strong> with an authenticator app, and check <strong>Active sessions</strong> under Account to
            log out devices you don&apos;t recognise.
          </p>
        ),
      },
      {
        id: "safety",
        title: "Block and report",
        body: (
          <p>
            Tap <strong>Block user</strong> on anyone&apos;s profile to stop them contacting you, and use <strong>Report</strong> on posts, profiles,
            products or stores that break the rules. Our team looks into reports.
          </p>
        ),
      },
      {
        id: "control",
        title: "Make it comfortable",
        where: { label: "Settings → Appearance / Account", href: "/settings/appearance" },
        body: (
          <p>
            Choose light, dark or match your phone under Appearance. You can change your password - or permanently delete your account - under
            Account.
          </p>
        ),
      },
    ],
  },
];

export default function CommunityGuidePage() {
  return (
    <GuideDocument
      current="/guides/community"
      title="Get started on Nestly"
      intro={<p>Nestly is where your people, your moments and your favourite sellers come together. Here&apos;s how to make the most of it.</p>}
      parts={parts}
      finish={{ label: "Join Nestly", href: "/signup" }}
    />
  );
}
