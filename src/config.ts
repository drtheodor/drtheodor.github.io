export const SITE_TITLE = "Theo's Workbench";
export const SITE_DESCRIPTION = "Welcome to my website!";
export const SITE_FOOTER = `Not so Copyright © ${new Date().getFullYear()} - Made with Astro 🚀 and absolute (frontend) incompetence.`;

export interface Sticker {
  position: [number, number];
  size: [number, number];
  rotation: number;
  image: string;
  avatar: "github" | string;
  profile: "github" | string;
  displayName?: string;
  quote?: string;
}

export interface HeaderItems {
  items?: Record<string, HeaderItem>;
}

export type HeaderItem =
  | ({
      prefix?: string;
      link: string;
    } & HeaderItems)
  | string;

export const HEADER: Record<string, HeaderItem> = {
  Home: {
    prefix: "🏠",
    link: "/",
  },
  Blog: {
    prefix: "✍️",
    link: "/blog",
    // items: {
    //   "Submenu 1": "/blog#",
    //   "Submenu 2": "/blog#",
    // },
  },
  About: {
    prefix: "ℹ️",
    link: "/about",
  },
};

type Social = {
  icon: string;
  url: string;
  text: string;
};

export const SOCIALS: Social[] = [
  {
    icon: "tabler:brand-mastodon",
    url: "https://fosstodon.org/@drtheo",
    text: "Follow on Mastodon",
  },
  {
    icon: "tabler:brand-x",
    url: "https://x.com/DrTheodor_",
    text: "Follow on Twitter (X)",
  },
  // {
  //   icon: "tabler:brand-bluesky",
  //   url: "https://bsky.app/profile/theo.is-a.dev",
  //   text: "Follow on Bluesky",
  // },
  {
    icon: "tabler:brand-github",
    url: "https://github.com/drtheodor",
    text: "Follow on GitHub",
  },
];
