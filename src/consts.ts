export const SITE_TITLE = 'Theo\'s Workbench';
export const SITE_DESCRIPTION = 'Welcome to my website!';
export const SITE_FOOTER = 'Made with Astro 🚀 and absolute incompetence.';

type Social = {
    icon: string,
    url: string,
    text: string,
};

export const SOCIALS: Social[] = [
    {
        icon: 'tabler:brand-mastodon',
        url: 'https://fosstodon.org/@drtheo',
        text: 'Follow on Mastodon',
    },
    {
        icon: 'tabler:brand-x',
        url: 'https://x.com/DrTheodor_',
        text: 'Follow on Twitter (X)',
    },
    {
        icon: 'tabler:brand-bluesky',
        url: 'https://bsky.app/profile/theo.is-a.dev',
        text: 'Follow on Bluesky',
    },
    {
        icon: 'tabler:brand-github',
        url: 'https://github.com/drtheodor',
        text: 'Follow on GitHub',
    },
];