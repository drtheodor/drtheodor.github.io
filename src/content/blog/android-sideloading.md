---
title: Android Sideloading
description: 'On how to circumvent the android sideloading "security" for distrubution of patched APKs.'
pubDate: 'Sep 02 2025'
heroImage: '@blog/placeholder-4.jpg'
category: Programming
tags:
    - Java
    - Android
---

Not so long ago, a friend of mine sent me news about a [new Android "security" feature](https://android-developers.googleblog.com/2025/08/elevating-android-security.html), coming out late 2026.

As this feature isn't out yet globally (and I don't live in the countries where that feature rolls out initially), this is more of a draft and a list of ideas that could possibly allow to automate installation of patched APKs after this security update rolls out globally.

As far as I've understood from the official Android Developers blog post, this is how it works:
№1. You sign up
№2. You put your package name
№3. You put your public keys
№4. You sign the APK with your private key and upload it for verification _once_

Ta-da! Your app should be installable.


> Also, I've heard somewhere that hobbyist accounts (the one that doesn't require a 25$ fee for registration) can only have so many installations for one package name, but I'm not sure if that's true or not (can't find the source either). 
> But, at the same time, they say that "developers will have the same freedom to distribute their apps directly to users through sideloading or to use any app store they prefer", which doesn't really match that up.

For the sake of everything, let's assume that there will be no downloads limit for the hobbyist plan, and you don't have to pay any fees.

The biggest problem is that when you apply the patches, you, inevitably, lose the signing. 
And it's not like you can just sign up a package with the same name, as according to the new policy, you have to get permission to use a more downloaded package name.
Which, obviously, might not happen for a lot of stuff where this sideloading applies.

So I, as someone who made [minecraft mods](https://theo.is-a.dev/blog/porting-fabric-to-forge/), I know of a way to change a package name without (almost) breaking anything!

## Remapping

In theory, if there are no download limits, then if someone gives their private key (specifically made for all this, obviously, guh), then an app can be remapped and re-signed.
If the same public key can be used in different packages, that's even better!

### Compatibility Solution

If someone makes an app that allows to open APKs, patch them using a provided package name and a private key then calling the default android APK installer, this should allow to achieve patched APK sideloading without the developers needing to take any actions.

But, ADB is still working without root, and doesn't seem to require any registration whatsoever... oh wait!

## ADB

ADB should still be able to install an app to a connected phone without registration. 

Making a wrapper around ADB and wiring it to install an app locally should circumvent all the registration, signing, etc.

Again, for convenience sake, if an android app is made that can open Android APKs and run ADB on them, this would allow to bypass all the security checks.
ADB _can_ be ran on Android, as seen in [this](https://www.reddit.com/r/AndroidQuestions/comments/1dg4xuj/any_way_to_run_adb_commands_from_the_phone/) reddit thread, where someone was able to run ADB through Termux!

## Sources
- [Introducing the Android Developer Console](https://developer.android.com/developer-verification/assets/pdfs/introducing-the-android-developer-console.pdf) (pdf)
- [Elevating Android security](https://android-developers.googleblog.com/2025/08/elevating-android-security.html) (blog post)
- [Any way to run ADB commands from the phone without root?](https://www.reddit.com/r/AndroidQuestions/comments/1dg4xuj/any_way_to_run_adb_commands_from_the_phone/) (r/AndroidQuestion)
