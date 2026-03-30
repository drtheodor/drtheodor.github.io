---
title: Optimizing Minecraft mods size
description: 'A story about how we made our Minecraft mod 53% smaller!'
pubDate: 'Mar 30 2026'
heroImage: '@blog/placeholder-2.jpg'
category: Programming
tags:
  - Java
  - Minecraft
---

At AmbleLabs ([GitHub](https://github.com/amblelabs), [Codeberg](https://codeberg.org/amblelabs)) we've been working hard on our first and 
most popular Minecraft mod Adventures in Time.

The mod is quite complex with about 100k lines of code and many _many_ assets ranging from original OST to models and textures.

At some point we've realised that our [debug builds](/blog/minecraft-mod-ci) are slowly inching closer and closer to the 100MB mark! 
This was unacceptable. By each release we added +10-20MBs in code and assets combined!

I took a quick look at what was taking all the space. Obviously, some space (about 11MBs) was taken by mod's datapack and code.

But everything else was taken by the assets. And then I remembered, there's a thing called [PackSquash](https://github.com/ComunidadAylas/PackSquash)!

> Minecraft: Java Edition resource and data pack optimizer which aims to achieve the best possible compression,
>  performance and protection, improving pack distribution, storage and in-game load times.

While we didn't really care about the "protection" part, everything else fitted the bill!

But how do we use it for our builds? Quite easily! We already had a publish workflow that looked something like that:
```yaml
on:
  workflow_dispatch:

permissions:
  contents: write

jobs:
  build:
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/release'
    steps:
      - name: Checkout Repository
        uses: actions/checkout@v3

      - name: Setup Java
        uses: actions/setup-java@v5
        with:
          distribution: "temurin"
          java-version: 21
          cache: gradle

      - name: Build
        run: |
          ./gradlew build

      - name: Publish (CurseForge/Modrinth/GitHub)
        uses: Kir-Antipov/mc-publish@v3.3                                   #The specified MC-Publish GitHub Action in the version 3.2
        with:
          changelog-file: CHANGELOG.md
          curseforge-id: 856138                                             #The id of your CurseForge project
          curseforge-token: "${{secrets.CURSEFORGE_TOKEN}}"

          modrinth-id: ZMP9ZjB9                                             #The id of your modrinth project
          modrinth-token: "${{secrets.MODRINTH_TOKEN}}"

          github-token: "${{secrets.GITHUB_TOKEN}}"

          github-generate-changelog: true
          version-type: release

          loaders: fabric
          java: "17"
```

As you see, it runs only on dispatch. It checks out the repository, sets up Java, builds the mod and publishes it using Kir Antipov's action.

This is where [PackSquash-action](https://github.com/ComunidadAylas/PackSquash-action) shines!

And this is how we added it:
```diff yaml
on:
  workflow_dispatch:

permissions:
  contents: write

jobs:
  build:
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/release'
    steps:
      - name: Checkout Repository
        uses: actions/checkout@v3
+        with:
+          fetch-depth: 0 # For PackSquash

      - name: Setup Java
        uses: actions/setup-java@v5
        with:
          distribution: "temurin"
          java-version: 21
          cache: gradle

      - name: Build
        run: |
          ./gradlew build
+
+      - name: Run PackSquash
+        uses: ComunidadAylas/PackSquash-action@v4
+        with:
+          packsquash_version: latest
+          options: |
+            pack_directory = './build/resources/main/'
+            output_file_path = '/tmp/pack.zip'
+
+      - name: Combine
+        run: ./scripts/merge_jar ./build/libs/ /tmp/pack.zip
    
      - name: Publish (CurseForge/Modrinth/GitHub)
        uses: Kir-Antipov/mc-publish@v3.3                                   #The specified MC-Publish GitHub Action in the version 3.2
        with:
          changelog-file: CHANGELOG.md
          curseforge-id: 856138                                             #The id of your CurseForge project
          curseforge-token: "${{secrets.CURSEFORGE_TOKEN}}"

          modrinth-id: ZMP9ZjB9                                             #The id of your modrinth project
          modrinth-token: "${{secrets.MODRINTH_TOKEN}}"

          github-token: "${{secrets.GITHUB_TOKEN}}"

          github-generate-changelog: true
          version-type: release

          loaders: fabric
          java: "17"
```

With the `/scripts/merge_jar` being a simple shell script:
```bash
#!/bin/bash

set -e  # Exit on any error

if [ $# -eq 0 ]; then
    echo "Usage: $0 <folder_path> <other_zip>"
    exit 1
fi

FOLDER_PATH="$1"
OTHER_ZIP="$2"

if [ ! -d "$FOLDER_PATH" ]; then
    echo "Error: Folder '$FOLDER_PATH' does not exist"
    exit 1
fi

JAR_FILE=$(find "$FOLDER_PATH" -maxdepth 1 -name "*.jar" -type f | head -n 1)

if [ -z "$JAR_FILE" ]; then
    echo "Error: No .jar files found in '$FOLDER_PATH'"
    exit 1
fi

echo "Found jar file: $JAR_FILE"

if [ ! -f $OTHER_ZIP ]; then
    echo "Error: $OTHER_ZIP does not exist"
    exit 1
fi

if [ -d "/tmp/unzipped" ]; then
    echo "Removing previous /tmp/unzipped directory"
    rm -rf "/tmp/unzipped"
fi

mkdir -p "/tmp/unzipped"

echo "Unzipping $JAR_FILE to /tmp/unzipped"
unzip -q "$JAR_FILE" -d "/tmp/unzipped/"

echo "Unzipping /tmp/pack.zip to /tmp/unzipped"
unzip -qo $OTHER_ZIP -d "/tmp/unzipped/"

rm -f "$JAR_FILE"

echo "Creating new jar file: $JAR_FILE"
#zip -qr "$JAR_FILE" "/tmp/unzipped"
jar --create --file=$JAR_FILE -C /tmp/unzipped .

echo "Cleaning up temporary files"
rm -rf "/tmp/unzipped"

echo "Process completed successfully!"
echo "Original file backed up as: $BACKUP_FILE"
echo "New jar file created: $JAR_FILE"
```

This effectively runs PackSquash on the build resources. PackSquash outputs a `.zip` resourcepack, which gets 
merged with the actual mod jar using the `merge_jar` script.

This brought us from 56.4MBs to 26.5MBs. This is a 53% improvement!

The mod, naturally, is now easier and faster to download and load! 

In future, we can make the workflow run on a schedule or on dispatch and push the changes back into the codebase 
(although, this is not as easy as it sounds, since datagen can generate resourcepack entries...).
