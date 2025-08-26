---
title: Writing Minecraft mods with Nix (Updated)
description: 'A definitive guide on how to set up your dev environment to make Minecraft mods with NixOS.'
pubDate: 'Aug 26 2025'
heroImage: '@blog/nixplusmc2.png'
category: Programming
tags:
  - Java
  - Minecraft
  - NixOS
---

Surprisingly enough, my most popular blog post was about modding Minecraft on NixOS.

Recently, an acquaintance of mine, [Wres](https://github.com/MrWrees) has asked me how I set up my dev environment for MC modding.

Apparently, he found out my blog post!

So I've decided to revisit this issue and provide an actually definitive guide on how to do MC mods with Nix.

## Requirements
- Nix (with flakes support)
- IntelliJ (every other Java IDE sucks for Minecraft modding)
- Direnv (optional)
- A Minecraft mod project

> Direnv is optional, however, recommended. It's gonna be much easier to use direnv, you're not gonna have to type `nix develop` every time you open the project's folder, additionally, there is an IntelliJ plugin for direnv support.

## Flake

Your `flake.nix` should be the following:
```nix
{
  inputs = {
    nixpkgs.url = "github:nixos/nixpkgs/nixos-25.05";
    flake-parts.url = "github:hercules-ci/flake-parts";
    systems.url = "github:nix-systems/default";
  };

  outputs = inputs:
    inputs.flake-parts.lib.mkFlake { inherit inputs; } {
      systems = import inputs.systems;

      perSystem = { config, self', pkgs, lib, system, ... }: let
        java = pkgs.jetbrains.jdk-no-jcef;

        nativeBuildInputs = with pkgs; [
          java
          git
        ];

        buildInputs = with pkgs; [
          libGL
          glfw-wayland-minecraft # Not always needed, but in case it is, it's here.
          flite # TTS
          libpulseaudio # Required for audio
        ];
      in {
        devShells.default = pkgs.mkShell {
          inherit nativeBuildInputs buildInputs;

          env = {
            LD_LIBRARY_PATH = lib.makeLibraryPath buildInputs;
            JAVA_HOME = "${java.home}";
          };
        };
      };
    };
}
```

This flake is locked on Nix packages 25.05, where `jetbrains.jdk-no-jcef` is JetBrains' JDK 21, which is commonly used for MC modding on versions 1.20 and above.

The reason why we're using JetBrains' JDK is because JBR supports DCEVM, which allows for hotswapping classes.

- `libGL` is a required dependency, without it, the game won't launch.
- `flite` is used in Minecraft for TTS, you can remove it if you don't need it.
- `libpulseaudio` is required for the game to play sounds, without it no sounds or music will play.

## Direnv

Your `.envrc` file should be the following:

```
use flake
```

Then run `direnv allow` in your shell, to allow loading the environment automatically.

## Setting up the IDE

First of all, we're gonna install some plugins for InteliJ. 
You're gonna need these plugins:
- [Minecraft Development](https://plugins.jetbrains.com/plugin/8327-minecraft-development)

If you're going the direnv route, you also going to need the following:
- [Direnv Integration](https://plugins.jetbrains.com/plugin/15285-direnv-integration) (if you're going the direnv route)

After installing this, restart your IDE. Then go to `Settings > Tools > Direnv Settings`.

In the "DirenvPath" field put the path to your direnv binary:
- `/etc/profiles/per-user/<username>/bin/direnv` (for HM direnv installations)
- `/run/current-system/sw/bin/direnv` (for configuration.nix direnv installations)

And turn on the appropriate options, e.g.:

![Example Configuration](@blog/nix-mc/direnv-config.png)

Close your IDE. Open the project's folder in your terminal, and run the IDE through the terminal while being in the project's folder (make sure you're in the correct environment, that is, you allowed direnv OR, if you're going the no direnv route, ran `nix develop`).

> Note: IntelliJ's binary's name is `idea-community` for IntelliJ Community Edition and `idea-ultimate` for IntelliJ Ultimate.

Do not worry, this procedure is needed to be done only once.

Now, open your project (if you haven't already), then go to `File > Project Structure`, in the popup go to "Project", and set the "SDK"  to the JDK from the "Detected SDKs" dropdown. This is the JDK that we've installed through the flake.

Then, go to `File > Settings > Build, Execution, Deployment > Build Tools > Gradle` and set "Gradle JVM" to be "Project SDK".

If you're using direnv, make sure to exclude the `.direnv` folder by right-clicking on it, then clicking `Mark Directory As > Excluded`.

You can re-open the IDE normally one.

## Running the game

### Direnv

- Open the project.
- You should get a notification "Direnv environment detected", suggesting you import it. Click the button.
- Run "Minecraft Client" gradle task.

### No Direnv

- Open the project's folder via terminal.
- Run `nix develop`.
- Open the IDE via terminal.
- Run "Minecraft Client" gradle task.

## Success!