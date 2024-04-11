# Project Name

SocialsJSON

## Table of Contents

- [Introduction](#introduction)
- [Features](#features)
- [Prerequisites](#prerequisites)
- [Getting Started](#getting-started)
  - [Installation](#installation)
  - [Configuration](#configuration)
- [Usage](#usage)
- [API Endpoints](#api-endpoints)
- [Testing](#testing)
- [Deployment](#deployment)
- [Contributing](#contributing)
- [License](#license)
- [Contact](#contact)

## Introduction

SocialsJSON is an API that can be used with any type of front end project that needs basic social media functionalities. The data are returned in JSON format.

You can use examples below to check how SocialsJSON works.
Feel free to enjoy it in your awesome projects!

This API was written using javascript.

## Features

The SocialJSON provide the following functionalites:

- register a user
- login a user
- create post
- like a post
- see the no of like and comments on a post
- comment on a post
- get user feed(see post of users that you follow)
- follow and unfollow a user
- see posts made by users
- see notification to users when their posts are liked, commented on and their when they are tagged in a post.

## Prerequisites

List of software and tools required to run your project.

- Node.js
- MongoDB
- Postman (optional, for testing API endpoints)

## Getting Started
You need to have node js installed. [For installation visit the guide](https://nodejs.org/en/download). The follow the guide thereafter.

### Installation

1. Clone the repository:

   ```bash
   git clone <https://github.com/malachi43/social-api.git>
   ```

## Install dependencies:

```bash
Copy code
cd social-api
npm install
```

## Configuration

Create a .env file in the root directory of your project:

```bash
Copy code
MONGO_URI= <mongodb://localhost:27017/db_name>
SESSION_SECRET= <your session secret>
CLOUD_NAME= <your cloudinary cloud name>
API_KEY= <cloudinary api key>
API_SECRET= <cloudinary api secret>
REDIS_URI= <redis connection uri>
```


## Usage

Instructions for using your API, including example requests and responses.


