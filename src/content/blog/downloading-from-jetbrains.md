---
title: Downloading IDEs and plugins from JetBrains in Russia
description: 'A how-to guide on accessing JetBrains stuff in Russia.'
pubDate: 'Nov 19 2025'
heroImage: '@blog/placeholder-1.jpg'
category: Programming
---

Downloading JetBrains stuff in Russia usually sends you to a [HTTP 451](https://en.wikipedia.org/wiki/HTTP_451) error code page.

## How to download plugins/themes
1. Open the plugin/theme page on JetBrains marketplace.
2. Select the version you want to download.
3. Click "Download".
4. See the error page.
5. Replace `https://plugins.jetbrains.com/` with `https://downloads.marketplace.jetbrains.com/` in your URL.
6. Voila!

## How to download IDEs
1. Go to the IDE download page.
2. See the 451 error page.
3. Replace `https://download.jetbrains.com/` with `https://download-cdn.jetbrains.com/` in your URL.
4. Voila!

## Automated
Obviously, remembering URLs is silly, so I've got an alternative automatic solution. 
It is a [TamperMonkey](http://tampermonkey.net/) script, which is commonly used for userscripts like this one!

- First, install [TamperMonkey](http://tampermonkey.net/). If you're using a chrome-based browser like Brave, Vivaldi or Opera you might need to follow [those](https://www.tampermonkey.net/faq.php#Q209) instructions after installation. For mobile users, it's available with [Firefox](https://addons.mozilla.org/en-US/android/addon/tampermonkey/), Edge and Vivaldi (as far as I'm aware).
- Second, get the script [here](https://theo.is-a.dev/jetbrains-ru.user.js), and just press "Install" (you might also need to enable it) and voila!
