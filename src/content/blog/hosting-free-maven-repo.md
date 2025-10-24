---
title: Hosting a free Maven repo on GitHub
description: 'How to host your Maven/Gradle artifacts on GitHub.'
pubDate: 'Oct 24 2025'
heroImage: '@blog/placeholder-1.jpg'
category: Programming
---

While working on a project and waiting for it to compile on [JitPack](https://jitpack.io), I thought to myself: 
we're already running the CI to build the project, and JitPack is running exactly the same build instructions but I have to wait more, and so do my colleagues 
(also there were some issues with loading transitive dependencies, allegedly?).

All of those problems were causing a helluva lot of incovenience! 

So, as a cheap bastard that I am, I've decided to host a maven repository on GitHub. This also allowed me to hook it up to the CI (which also sped up the publishing process significantly). 
Among other things, transitive dependencies were now getting resolved correctly. Not to mention I didn't have to pay a dime and use my domain name for it.

You can see the GitHub repository [here](https://github.com/drtheodor/maven) and the nice UI I made for it [here](https://theo.is-a.dev/maven).

For this purpose I built a static site with AstroJS, DaisyUI and TailwindCSS that generates a HTML website and an index file for search, which allows to explore the published files.

## Setting up the maven repository

- Create a new public GitHub repository.
- Turn on GitHub Pages with GitHub Actions.
- Write a workflow like [this](https://github.com/drtheodor/maven/blob/main/.github/workflows/deploy.yml) to build and deploy the generated website.

All files put into this repository should trigger a workflow that generates the website! Open it to confirm everything's working correctly and follow the next steps to set up automatic publishing.

## Setting up CI publishing

- Create a PAT or a SSH key (as of the time of writing, not supported) for the maven repo (make sure it has access to write to the repository!) and put it in your repository's secrets.
- Create publications in your `build.gradle`:
```groovy
publishing {
	publications {
		create("mavenJava", MavenPublication) {
			artifactId = project.archives_base_name
			from components.java
		}
	}

	repositories {
		maven {
			name = "ci"
			url = providers.environmentVariable("CI_MAVEN_PATH")
		}
	}
}
```
- Add a workflow with the following steps (replace `BOT_TOKEN` with the token you put into the repository's secrets beforehand and `YOURNAME/YOURMAVENREPO` with your maven github repository!):
```yaml
- name: Build for Maven
      env:
        CI_MAVEN_PATH: ${{ runner.temp }}/maven
      run: ./gradlew publishMavenJavaPublicationToCiRepository
- name: Publish to Maven
      uses: drtheodor/static-file-server-actions/upload@main
      with:
        repo: YOURNAME/YOURMAVENREPO
        path: ${{ runner.temp }}/maven
        token: ${{ secrets.BOT_TOKEN }}
        message: "chore: publish artifacts"
```

When running this workflow it should copy over the artifacts to your GitHub maven repo, which will then build as a nice website!
