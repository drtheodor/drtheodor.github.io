---
title: Hosting a free Maven repo (Part 2)
description: 'How to host your Maven/Gradle artifacts for free.'
pubDate: 'July 17 2026'
heroImage: '@blog/placeholder-2.jpg'
category: Programming
---

This is a follow-up article to my [part 1](/blog/hosting-free-maven-repo/), where we tried hosting artifacts on GitHub.

Yes, the experiment failed. Somewhat.

It worked for a good while, it worked for months, actually, but, in the end, we got hit by GitHub Pages' soft limit of 1 GB...

Oh well!

Buuut if you think that I'd give up after this, you're wrong!

As we were inching closer to the final release of AIT 1, I've realised that our maven has started failing a lot, so, naturally, I've decided to
find an alternative.

I had 2 options:
- host something on Clouflare workers & R2 (free!): can be private, can be public, do whatever.
- come back to JitPack: only public git repos.

...and I've chosen the less adventurous option B. In a year or two my cheap ass would most likely come back to this and implement option A.

But then, reading jitpack's docs, I've found it! You can use your own domains with JitPack and even your own git servers! This was a huge discovery.

Naturally, first things first, I've managed to persuade Loqor into updating the DNS records for our domain. I've made him make a `CNAME` record for `maven.amblelabs.dev` to point to `jitpack.io` 
and a `TXT` record for `git.amblelabs.dev` to point to `https://github.com/amblelabs` (as per the docs).

Now our stuff could be posted on JitPack and searched by a custom domain. So stuff like

```groovy
repositories {
  maven {
    url "https://maven.amblelabs.dev"
  }
}
```

...would work as well.

Another nice thing we had with our "custom" maven, is all builds would be available straight away. With JitPack, however, you have to update your deps, click refresh, then wait
for ages for IntelliJ and Gradle to refresh, and then you get hit with an error saying that there are no artifacts with that version!
You go and check, only to find out it only begun building! Annoying.

JitPack's docs provide a solution for this: webhooks. I've tried them, didn't work well.

However, after clicking buttons and pulling lever with Chrome's devtools I've found an endpoint that can trigger a build for a certain commit.

Naturally, I've put it in our GitHub Actions CI:
```yaml
# ...
  jitpack:
    runs-on: ubuntu-latest
    steps:
    - run: |
        curl "https://jitpack.io/api/builds/dev.amblelabs/ait/${GITHUB_SHA:0:10}" -H 'dnt: 1'
```

This forcefully triggers a build for our artifact in the `ait` repository! Really nice.

If anything, I'd recommend this method instead of whatever I did previously, unless your scope is really small and you can't aford a domain.
