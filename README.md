# Table of Contents

- [Getting started (how to test your code on your machine)](#Getting-Started)
- [MUST READ BEFORE CONTRIBUTING](#MUST-READ)

# Getting Started

The next.js framework covers all functionalities within frontend and backend.
First, to run, don't fear cause its easy af, but read all these steps carefullly

## 1.1 Tools used for next.js
- stripe: for payment 
- daily: for video recording
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

## 1.4 run the code LFG
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
## Contributing to the code guidelene



## Set up Frontend

You must then setup the frontend which handles the user interface and user interaction.

1. install required packages
2. populate the env file with the backend url and supabase keys
3. run the frontend

(if it's not working make sure supabase is started and stripe is listening)





## Tools used

- Stripe
- Daily
- OpenAI
- Cartesia
- Supabase
- React
- Nextjs
