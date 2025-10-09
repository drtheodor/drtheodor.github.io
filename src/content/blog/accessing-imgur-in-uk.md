---
title: Accessing Imgur images in UK
description: 'A how-to guide on accessing imgur images in UK, because why not.'
pubDate: 'Oct 09 2025'
heroImage: '@blog/placeholder-2.jpg'
category: Programming
---

The story went like this.
So, a [colleague](https://github.com/addi3) of mine at [AmbleLabs](https://github.com/amblelabs) sent a message in the team chat:
> Addie: Does anyone know any good VPN?

As a russian, there's no way I wouldn't know something as trivial as that! But why would they need a VPN for?

Apparently, imgur's parent company has decided to block imgur off from UK after a new law was passed!

So, after a few experiments, I have come up with this script that allows you to access imgur images from your browser.

It is a [TamperMonkey](http://tampermonkey.net/) script, which is commonly used for userscripts like this one!

- First, install [TamperMonkey](http://tampermonkey.net/). If you're using a chrome-based browser like brave, vivaldi or opera you might need to follow [those](https://www.tampermonkey.net/faq.php#Q209) instructions after installation.
- Second, get the script [here](https://theo.is-a.dev/imgur-uk.user.js), and just press "Install" (you might also need to enable it) and voila!

This script uses duckduckgo's image proxy.
