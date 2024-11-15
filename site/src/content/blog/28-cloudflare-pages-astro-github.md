---
title: "Deploy your Astro website to Cloudflare Pages with protected preview deployments"
pubDate: 2024-09-14
description: "You can deploy your website (e.g. build with Astro) on Github to Cloudflare Pages in under an hour. Including protected preview deployments and cleanup"
author: "Aaron Czichon"
image:
  src: "https://directus.aaronczichon.de/assets/857e0b43-b625-4804-8969-020a55094bee.jpeg?quality=70&width=1024"
  alt: "A sketch in orange showing some clouds, website and computer connected with arrows through a server symbol."
tags: ["Development", "Work"]
---

I recently moved one of my projects to Cloudflare Pages and it's awesome.  
The setup, deployment and configuration are straight forward and you get preview deployments out of the box.  
In this post I'll walk you through on how you can set it up for your own project using Astro (or whatever static site generator you prefer), Github and Cloudflare Pages.

## What will be covered?

- Create a Cloudflare Pages project
- Setting up a custom domain for the project
- Protecting preview deployments so that your test environment are not accessible for everyone
- Cleanup PR preview deployments after PR is merged

## What do you need?

- A project on Github (I'm using an Astro project for this)
- A Cloudflare account
- A custom domain (access to it's DNS configuration)

## Preparations

For demo purposes we're going to use the Github repository which I have for my articles.  
You can find that repository here: https://github.com/aaronczichon/aaronczichon.de.

To follow everything step-by-step you can create your own new Github repository and create a new Astro website in it.  
I used the guideline from `npm create astro@latest` CLI and create it into a new sub-folder called `demo-blog` by using the Astro blog template.  
Feel free to clone the project above, navigate to the folder, install dependencies (`npm i`) and run it with `npm start` to explore:
![Screenshot of the Astro blog demo template running inside the browser.](https://directus.aaronczichon.de/assets/7d1c71e3-7fdf-47c0-b86f-dcdf0923d74b.png)

Also make sure you have a domain linked in your Cloudflare account to continue.

## Step 1: Create Cloudflare Pages project

![Shows a screenshot of the cloudflare sidebar menu with the "Overview" entry of the "Workers & Pages" section highlighted.](https://directus.aaronczichon.de/assets/3be8cfa1-b4df-4e9c-8828-0c36b2fb6faf.png)

Login to your Cloudflare account. On the menu select, in the `Workers & Pages` section, the `Overview` menu entry.  
Select `Create`, `Pages` and then `Connect to Git`.  
Use `Github`, select your account with the repository, select the repository and click on `Begin Setup`:
![Screenshot of the Cloudflare Pages setup page where you select your git provider and the repository of your account.](https://directus.aaronczichon.de/assets/7b6d93a8-2c64-4f7f-ad40-37e8fe96dcb9.png)

Give your project a proper name, I'll call it `ac-demo-blog` and select your production branch (which is normally `main` on Github).  
In the `Build settings` section select `Astro` as your `Framework preset`. Your `Build command` should be the one in your `package.json` (default is `npm run build`).

As I created the Astro project in my repository under a sub-folder (`demo-blog`) I need to change the root directory path under `Root directory (advanced)` to `demo-blog`.  
If you need any environment variables during build time of your Astro page (e.g. if you fetch data from an API with an API-Key), you can add them in the `Environment variables` section.

If you have set all your configurations, click on `Save and Deploy` to run your first deployment.

> Hint: Make sure you have a valid `package-lock.json` in your repository. Otherwise the deployment will fail as Cloudflare runs `npm ci` for a clean install.

After your deployment is successful, you will see the overview of your deployments.  
![Screenshot of the Cloudflare Pages dashboard of a project showing the deployments.](https://directus.aaronczichon.de/assets/bbe8982d-3dac-460b-9b5f-794b32c104c9.png)

In this dashboard you can see your production URL (`1`). You can also see the deployments of every commit (`2`) you've done on your project and the deployments for every branch (`3`).  
Every deployment is public visible and accessible.

## Step 2: Connect a custom domain

If you have a domain for your project, you may want to connect your Pages project to that domain instead of using a `*.pages.dev` domain from Cloudflare.  
For this you need to go to `Custom Domains` on your Pages project and click on `Set up a custom domain`.  
Pick a domain or subdomain you own. In my case I'll use `demo-blog.czichon.cloud` for the project. Click `Continue`.

If your domain is registered and managed through Cloudflare it can automatically update your DNS for you by clicking on `Activate domain`:
![Screenshot of adding a custom domain to the DNS of a Cloudflare domain](https://directus.aaronczichon.de/assets/32b9f9f8-6cb1-4420-8269-ebce398c451f.png)

> Hint: Depending on your location and ISP it can take up to 48h for the DNS records to be updated everywhere.

If the setup was successful, Cloudflare will automatically enable SSL for your site and your project will be available through that new domain.

## Step 3: Hide preview deployments behind Cloudflare Access

While you're building your website, you may test different versions, features and branches of your project.  
You probably don't want them to be publicly accessible on the internet.  
Cloudflare has a good solution for this called Cloudflare Access.  
With Cloudflare Access you're able to restrict access to specific resources by creating a matching rule. These resources are available then only by a list of allowed E-Mail addresses which get an access link and/or a one time token every time they request it.

To configure it for your project you need to go to the `Manage` section of your project and click on `Enable access policy` under the `Access policy` section.  
This will create you a default policy which restricts the access to all of your preview deployments under your project (which, in my case, is everything under `*.ac-demo-blog.pages.dev`). They're now only accessible for the E-Mail address of your account.
![Screenshot of Cloudflares "Access policy" section on Cloudflare Pages project.](https://directus.aaronczichon.de/assets/8a379cb6-51de-46ea-b719-cf9e6bdeff38.png)

You can directly try it out by picking one of your deployments that is not on the production branch:
![Screenshot of a Cloudflare Access protected page where you should enter a valid email for access](https://directus.aaronczichon.de/assets/0132cf80-a8fb-4003-8771-03af9e8736ae.png)

You need to enter your E-Mail address of your Cloudflare account to get a link and/or token to enter to get access to the deployment. Isn't that cool!

If you have more people on the team that are allowed to see these deployments you can change the policy in Cloudflare Access. Just click on `Manage policies` in the `Access policy` section. You’ll be redirect to the Cloudflare Access portal.  
Click on your project (in this demo case it's called `ac-demo-blog - Cloudflare Pages`) and click at the opening panel on `Edit`.  
On the `Policies` tab click on your policy (normally called `Allow Members - Cloudflare Pages`) and `Edit` to edit the members.

![Screenshot of Cloudflare Access editing a policy in the "Configure rules" section](https://directus.aaronczichon.de/assets/c27d5821-e2c2-44ea-8cd3-34824d971269.png)

Here you can add more E-Mail addresses or other conditions to grand access to your deployments.

One last, optional, step would be to also restrict access to the production URL of your project under the `.pages.dev` domain.  
Currently, with the custom domain, my production site is available through `demo-blog.czichon.cloud` and `ac-demo-blog.pages.dev`.  
Normally you don't want to have your website and it's content available through multiple domains. We only want the content publicly accessible through the custom domain.  
So for this case we need to change our access rule to also apply to the domain of `ac-demo-blog.pages.dev`.

In the dashboard of your application inside Cloudflare Access go to the `Overview` page.

![Screenshot of the Cloudflare Access dashboard of the application overview](https://directus.aaronczichon.de/assets/527bb44d-638a-442d-ac0e-0d4e34cf2279.png)

Here you can see that the policy currently only applies to every domain that is a sub domain of `.ac-demo-blog.pages.dev` (see the `*`).  
Here we need to add a new condition. So under `Application domain` select `+ Add domain` and leave `Subdomain` empty. Scroll down and save it with a click on `Save application`.  
Now the domain `ac-demo-blog.pages.dev` is also protected with that policy and your project is only public accessible through the production deployment on your custom domain. Nice!

## Step 4: Delete preview deployment after Pull Request merge

Deployments of your branches and previews of your changes are going hand in hand with pull requests on Github.  
But the longer you use your project, and implementing new things, the more deployments you get on Cloudflare.  
Sure, you could delete every deployment by hand from time to time but that‘s not something you want to do.

A simple way to achieve this automatically on Github is by using a Github workflow which will be executed as soon as a pull request is closed.

Let's do some coding! (besides your actual project).  
Clone your repository, create a new branch (e.g. `ci/deployment-deletion`) and open it in your IDE/editor.

Create a new folder `.github` and a new sub folder of it called `workflows`.

In this folder we create a new file called `tmpl-cf-delete-preview.yaml` with the following template:

```yaml
name: Delete Cloudflare Page

on:
  workflow_call:
    inputs:
      REPOSITORY:
        required: true
        type: string
      REPOSITORY_NAME:
        required: true
        type: string
      PULL_REQUEST_NUMBER:
        required: true
        type: string
    secrets:
      GH_TOKEN:
        required: true
      CLOUDFLARE_API_TOKEN:
        required: true
      CLOUDFLARE_ACCOUNT_ID:
        required: true

jobs:
  delete-preview-deployment:
    name: Delete Preview Deployment
    runs-on: ubuntu-latest
    steps:
      - name: Get branch name
        id: get-branch
        run: echo "branch=$(gh pr view $PR_NO --repo $REPO --json headRefName --jq '.headRefName')" >> $GITHUB_OUTPUT
        env:
          REPO: ${{ inputs.REPOSITORY }}
          PR_NO: ${{ inputs.PULL_REQUEST_NUMBER }}
          GITHUB_TOKEN: ${{ secrets.GH_TOKEN }}

      - name: Delete via API
        run: |
          DEPLOY_BRANCH="${{ steps.get-branch.outputs.branch }}"
          deployment_ids=$(curl -s -X GET "https://api.cloudflare.com/client/v4/accounts/${{ secrets.CLOUDFLARE_ACCOUNT_ID }}/pages/projects/${{ inputs.REPOSITORY_NAME }}/deployments" \
            -H "Authorization: Bearer ${{ secrets.CLOUDFLARE_API_TOKEN }}" \
            -H "Content-Type: application/json" \
            | jq -r --arg DEPLOY_BRANCH "$DEPLOY_BRANCH" '.result[] | select(.deployment_trigger.metadata.branch == $DEPLOY_BRANCH) | .id')

          for deployment_id in $deployment_ids; do
            echo "Deleting deployment $deployment_id"
            curl -s -X DELETE "https://api.cloudflare.com/client/v4/accounts/${{ secrets.CLOUDFLARE_ACCOUNT_ID }}/pages/projects/${{ inputs.REPOSITORY_NAME }}/deployments/$deployment_id?force=true" \
              -H "Authorization: Bearer ${{ secrets.CLOUDFLARE_API_TOKEN }}" \
              -H "Content-Type: application/json"
          done
```

I created this workflow as a reusable workflow so you can add it to your workflows repository or whatever and reuse it for every project.  
In our example we're going to reuse it inside this repository.

<details>
<summary>A more detailed description on what the workflow does</summary>
The workflow requires 3 inputs: `REPOSITORY`, `REPOSITORY_NAME` and `PULL_REQUEST_NUMBER`.   
These are required by the script to get the correct branch name based on the pull request that is triggering the workflow.   
Along them the workflow needs 3 secrets: `GH_TOKEN`(obviously needed to access the repository), `CLOUDFLARE_API_TOKEN` and `CLOUDFLARE_ACCOUNT_ID`.   
The Account ID is used to identify your account and the API token is required to make an authenticated request to the deletion API to delete a deployment.

The step `Delete via API` goes throw all deployments related to a specific branch (the one of the merged PR) and deletes them each by each.

</details>

Next we need a workflow which is one that runs on pull request closed.  
Create a new file called `pr_closed.yaml` with this configuration:

```yaml
name: Delete Cloudflare Pages Preview Deployment

on:
  pull_request:
    types: [closed]

jobs:
  delete-cf-page-preview:
    name: Delete Cloudflare Pages Preview Deployment
    uses: ./.github/workflows/tmpl-cf-delete-preview.yaml
    secrets:
      GH_TOKEN: ${{ secrets.GITHUB_TOKEN }}
      CLOUDFLARE_API_TOKEN: ${{ secrets.CLOUDFLARE_API_TOKEN }}
      CLOUDFLARE_ACCOUNT_ID: ${{ secrets.CLOUDFLARE_ACCOUNT_ID }}
    with:
      REPOSITORY: ${{ github.repository }}
      REPOSITORY_NAME: "ac-demo-blog"
      PULL_REQUEST_NUMBER: ${{ github.event.pull_request.number }}
```

Go to the settings of your repository and add the 3 secrets `CLOUDFLARE_ACCOUNT_ID`, `CLOUDFLARE_PROJECT_NAME` and `CLOUDFLARE_API_TOKEN` to it.  
Make sure that `REPOSITORY_NAME` is matching the name of your Cloudflare Pages project name. If yes, you can use `${{ github.event.repository.name }}` as input. Otherwise, like us now, you need to give the name of the project.

_Hint: You can generate a new API token for Cloudflare if you click inside the Dashboard on the profile on the top right and selecting `My Profile`._  
_Then go to `API Tokens` and click on `Create Token`. Select `Custom Token`. Give it a proper name and under `Permissions` add one with `Account | Cloudflare Pages | Edit`.  
Then go to `Continue to summary` and `Create token`._

_2. Hint: The Account ID can be found in the right column of the `Workers & Pages` dashboard._

Commit your new workflows and create a pull request on your repository.  
Cloudflare creates you a nice little comment on the PR if the deployment was successful (or failed):
![Screenshot of a Cloudflare Pages github comment on a pull request with a successful deployment](https://directus.aaronczichon.de/assets/86a92bc0-0021-4fa7-9597-b5f2cdbd7a71.png)

You can see that Cloudflare created a new deployment for this branch, or more specific, for that commit of this branch.  
If I would add more commits to this branch (and therefore this pull request) it would create deployments for them as well.

![Screenshot of the Cloudflare dashboard with deployment to the Pages project](https://directus.aaronczichon.de/assets/3e216796-2f76-4301-b1e2-a39d7fe920b9.png)

Now we merge this pull request and it runs the workflow on closing the PR.  
This workflow deletes all deployments related to that branch during the workflow execution.

After the workflow is run successfully you now only see deployments from your production branch (`main`).

## Conclusion

Now we have a full setup on Cloudflare Pages using a Github repository with an Astro project (but could also be any other website with HTML, CSS and JS assets).  
This setup has custom deployments on every commit, protected preview deployments and a cleanup on pull request merge.

The best part: You can build that all under an hour and for free on Cloudflare. Nice 😎

If you want to support me writing more of these articles I would appreciate your [support by buying me a coffee](https://buymeacoffee.com/aaronczichon.de).
