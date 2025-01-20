# Table of Contents

https://github.com/Talentora-Organization/Talentora-codebase

- [Getting started (how to test your code on your machine)](#Getting-Started)
- [MUST READ BEFORE CONTRIBUTING](#MUST-READ)
- [File structure](#File-structure)
- [Troubleshooting](#Troubleshooting)

# Getting Started

The next.js framework covers all functionalities within frontend and backend.
First, to run, but read all these steps carefullly

## 1.1 Tools used

- next.js: frontend/backend development
- Vercel: deployment
- GitHub: repository use, CI/CD
- stripe: for payment
- daily: for video recording
- ShadCN: UI components
- [RTVI](#https://github.com/rtvi-ai): Real time voice interface
- **Supabase**: for auth and database

## 1.2 To install dependencies

Follow these steps

1. git clone this repository
2. Install dependencies & run dev server

```
npm install
```

3. Now you need to download Supabase,

## 1.3 How to Download and Run Supabase Locally:

You will need **Docker** to run Supabase locally. If you don’t have Docker installed, follow these steps:

### Install Docker:

- [Docker Desktop for Windows/Mac](https://www.docker.com/get-started)
- [Docker for Linux](https://docs.docker.com/engine/install/)

Make sure Docker is running on your machine before proceeding.

The Supabase CLI allows you to run a local instance of Supabase, manage environments, and perform database migrations.
**Install the Supabase CLI** by running the following command depending on your operating system:

### On macOS/Linux (homebrew):

```bash
brew install supabase/tap/supabase
```

### On Windows (via scoop):

```
scoop bucket add supabase https://github.com/supabase/scoop-bucket.git
scoop install supabase
```

3. dev server is for testing purpose only. The actual code will be built using npm run dev

## 1.4 run the test code

1. Run the docker daemon (docker)
2. Run the following code

```
npm run supabase:start
```

3. On a different terminal tab run this code

```
npm run dev
```

**Note that this is for testing purposes only. If you would like to write code and contribute read the following section: MUST READ**

# MUST READ

# Contributing to the code guidelene

Our goal is to make a succesfull project. To make this process go as smooth as possible, we want to keep some rules when contributing to Github

## Branch guidlines

We have a set of branches for production. However, no matter what, **NEVER DIRECTLY PUSH TO MAIN OR DEV BRANCH**
Follow these step.

1. Whenever you want to fix a bug or add a new feature, **always** start by making a new branch.
   - Follow the naming guidlines indicated in this website: https://medium.com/@abhay.pixolo/naming-conventions-for-git-branches-a-cheatsheet-8549feca2534
   - In the github project root directory

```
git checkout -b your-branch-name
git push -u origin your-branch-name
```

2. Once you're done contributing, run:

```
git add .
git commit -m "your commit message"
git push
```

3. We want to make sure that the commit messages are organized. If you have multiple commits on your branch:

```
git log
```

to see how many commits you have. Then run

```
git reset HEAD~(number of your commits)
git add .
git commit -m "your commit message"
git push --force
```

4. Finally, we want to merge the code to dev. On github, navigate to Pull requests, then set the base branch to dev, and compare branch to your branch.
5. Then, click "Create pull request"
6. Ping Ben or Lucas

# Troubleshooting

When you face unexpected errors/bugs, please contact either
Ben Gardiner (bengard@bu.edu)
Lucas Yoon (lyoon02@bu.edu, 617-816-9352)

## Set up Frontend

You must then setup the frontend which handles the user interface and user interaction.

1. install required packages (e.g. pnpm install)
2. populate the env file with the backend url and supabase keys
3. run the frontend (e.g. pnpm run dev)

(if it's not working make sure supabase is started and stripe is listening)

# File structure

- app
  - (pages) -> Holds all the pages components
    - account ->
    - bot -> conversational AI bot page
    - dashboard -> dashboard displaying all jobs
    - interviewConfig -> page to edit the job settings
    - InterviewQuestions -> page to edit the job's interview question settings
    - JobPage -> displays information about a particular job
    - pricing -> displays pricing information from stripe
    - settings -> settings include email, stripe account, etc.
    - signin

## Tools used

- Stripe
- Daily
- OpenAI
- Cartesia
- Supabase
- React
- Nextjs
