---
title: Minecraft Mod CI
description: 'How we automated testing and set up various CI for our Minecraft Mod'
pubDate: 'Mar 29 2026'
heroImage: '@blog/minecraft-mod-ci.png'
category: Programming
tags:
  - Java
  - Minecraft
---

_(Not affiliated with GitHub, Mojang or Microsoft)_

At AmbleLabs ([GitHub](https://github.com/amblelabs), [Codeberg](https://codeberg.org/amblelabs)) we've been working hard on our first and 
most popular Minecraft mod Adventures in Time.

The mod is quite complex with about 100k lines of code.

We didn't want to test stuff ourselves manually, and we wanted to use Minecraft's gametest framework... 
And then we've realised that our Donators haven't seen a beta build in weeks!

This wasn't good.

Obviously, we had some basic CI that checked the build status, but this wasn't enough.

Then I've had an idea: what if the build would automatically get built, tested and sent over to our Discord in a channel where donators 
(and, potentially, testers) could play with it!

And that's what we've done:
```yaml
name: Automated Builds

on:
  workflow_dispatch:
  push:
      paths:
        - src/**
        - build.gradle
        - gradle.properties
        - settings.gradle
        - gradle/**
        - gradlew
        - gradlew.bat
        - versioning.gradle
        - .github/workflows/publish-devbuilds.yml

jobs:
  build:
    runs-on: ubuntu-latest
    permissions:
      contents: read

    steps:
    - uses: actions/checkout@v4

    - name: Setup Gradle
      uses: gradle/actions/setup-gradle@v5
      with:
        cache-encryption-key: ${{ secrets.GRADLE_ENCRYPTION_KEY }}

    - name: Set up JDK 17
      uses: actions/setup-java@v4
      with:
        java-version: '21'
        distribution: 'temurin'
        cache: 'gradle'

    - name: Build
      run: ./gradlew --configuration-cache build

    - name: Publish artifacts
      uses: drtheodor/discord-webhook-upload-action@v0.2
      with:
        url: ${{ secrets.DEV_BUILDS }}
        username: george washington
        avatar: 'https://i.imgur.com/uiFqrQh.png'
        
        message_commit: '> :sparkles: [${commitMessage}](<${commitUrl}>) by [${authorName}](<${authorUrl}>)'
        message_header: |
          <:new1:1253371736510959636><:new2:1253371805734015006> New `Adventures in Time` dev build `#${{ github.run_number }}`:

        file: |
          build/libs/*.jar
          !build/libs/*-sources.jar
```

The `DEV_BUILDS` secret here points to a Discord webhook url. 
> ### (!) Note
> You can disable configuration cache if your `build.gradle` does not support it by removing the `--configuration-cache` argument.
> The build may fail if you try to build with configuration cache while having a buildscript that can't be cached.

And voila, when changing any file listed in `paths`, the mod gets built and sent over to our Discord for people to test!

However, builds were still named the same. We couldn't find out which commit people used... So we've changed our versioning behavior to be 
as follows:

`versioning.gradle`:
```groovy
import java.util.Optional

class CI {

    static final String REFS_PREFIX = "refs/heads/"

    static Optional<String> branch() {
        // groovy is very bad at globals, apparently.
        return Optional.ofNullable(System.getenv("GITHUB_REF"))
                .filter { it.startsWith(REFS_PREFIX) }
                .map { it.substring(REFS_PREFIX.length()).replaceAll("/", "-") }
    }

    static Optional<String> buildNum() {
        return Optional.ofNullable(System.getenv("GITHUB_RUN_NUMBER"))
    }
}

class Versioning {

    static final String BRANCH_MAIN = "main"
    static final String BRANCH_RELEASE = "release"

    static final String BUILD_RELEASE = "release"
    static final String BUILD_LOCAL = "local"
    static final String BUILD = "dev"

    static Optional<String> getBranch() {
        return CI.branch()
                .filter { it != BRANCH_MAIN && it != BRANCH_RELEASE }
    }

    static Optional<String> getBuild() {
        return CI.branch()
                .filter { it != BRANCH_RELEASE }
                .flatMap { CI.buildNum() }
    }

    static String getQualifier() {
        return CI.branch()
                .map { it == BRANCH_RELEASE ? BUILD_RELEASE : BUILD }
                .orElse(BUILD_LOCAL)
    }
}

String createVer(boolean includeBuild) {
    String qualifier = ""

    Versioning.branch.ifPresent { branch ->
        qualifier += "$branch-"
    }

    qualifier += Versioning.qualifier

    Versioning.build.filter { includeBuild }.ifPresent {build ->
        qualifier += ".$build"
    }

    return "$project.mod_version-$qualifier+mc.$project.minecraft_version"
}

ext.getPublicVersion = {
    return createVer(true)
}

ext.getArtifactVersion = {
    return createVer(false)
}
```

Then just use it in `build.gradle`:
```
apply from: 'versioning.gradle'

version = getPublicVersion()
```

This uses the following properties:
```
mod_version = 1.2.13
mod_version_qualifier=release
minecraft_version=1.20.1
```

The resulting mod name turns out to be `ait-1.2.13-build.1670-feat-chairs+mc.1.20.1.jar` with the build number being the CI run number.

It also contains the branch name, which can be easily identified!
