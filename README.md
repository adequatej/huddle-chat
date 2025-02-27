# Final Project

_Due at noon on the day of your team's assigned class presentation. Teams will be presenting
during the last week of class on Tuesday, Thursday, and Friday (March 4, 6, 7)_

For your final project, you'll implement a web application that exhibits understanding of the course materials.
This project should provide an opportunity to both be creative and to pursue individual research and learning goals.

## Final Project Description

- Your project should consist of a complete Web application, exhibiting facets of the three main sections of the course material:
- Static web page content and design. You should have a project with a well-designed user interface that is responsive, accessible, easily navigable, and features significant content.
- Dynamic behavior implemented with JavaScript or Typescript.
- Server-side programming using Node.js – either JavaScript or Typescript. Typically, this will take the form of some sort of persistent data (database), authentication, and possibly server-side computation.
- A video (less than five minutes) where each group member explains some aspect of the project. An easy way to produce this video is for you all the group members to join a Zoom call that is recorded; each member can share their screen when they discuss the project or one member can "drive" the interface while other members narrate (this second option will probably work better.) The video should be posted on YouTube or some other accessible video hosting service. Make sure your video is less than five minutes, but long enough to successfully explain your project and show it in action. There is no minimum video length.

## Deliverables

The README for your submitted repo should include

1. A brief description of what you created, and a link to the project itself (two paragraphs of text)
2. Any additional instructions that might be needed to fully use your project (login information etc.)
3. An outline of the technologies you used and how you used them.
4. What challenges you faced in completing the project.
5. What each group member was responsible for designing / developing.
6. A link to your project video.

Think of 1,3, and 4 in particular in a similar vein to the design / tech achievements for A1—A4… make a case for why what you did was challenging and why your implementation deserves a grade of 100%.

### Turning in Your Project

Push the final version of your term project to the GitHub repo you accepted for the assignment.

Deploy your app, in the form of a webpage, to Glitch, Vercel, AWS, Heroku or some other service; it is critical that the application functions correctly wherever you post it.

---

# Huddle Chat

## Table of Contents

- [Team Members](#team-members)
- [Project Description](#project-description)
- [Technologies](#technologies)
- [Dev Setup](#dev-setup)
  - [Install dependencies](#install-dependencies)
  - [Run the development server](#run-the-development-server)
  - [Build for production](#build-for-production)
  - [Run the production server](#run-the-production-server)
  - [Lint](#lint)
  - [Format](#format)
  - [Environment variables](#env)
- [API Docs](#api-docs)
  - [MBTA](#mbta)
    - [Get Array of Nearest Stops](#get-array-of-nearest-stops)
    - [Get Array of Nearest Vehicles](#get-array-of-nearest-vehicles)
  - [Chat](#chat)
    - [Get User's Chat Messages](#get-users-chat-messages)
    - [Get Chat Messages by Chat ID](#get-chat-messages-by-chat-id)
    - [Send Chat Message](#send-chat-message)
    - [Send Chat Reply](#send-chat-reply)
    - [Send Chat Reaction](#send-chat-reaction)

## Team Members

| Name           | GitHub Username                                 |
| -------------- | ----------------------------------------------- |
| Jed Geoghegan  | [adequatej](https://github.com/adequatej)       |
| Leo Hirano     | [notLeoHirano](https://github.com/notLeoHirano) |
| Benson Lin     | [Zirins](https://github.com/Zirins)             |
| Daniel Stoiber | [da-stoi](https://github.com/da-stoi)           |
| Bryan Suria    | [BSuria](https://github.com/BSuria)             |

## Project Description

Huddle chat is a web application that allows users to chat with other users on MBTA public transport. Users can chat with other users on the same vehicle or at the same stop. Users can also react to messages and reply to messages. After signing in, users can see the nearest stops and vehicles to them. If a user is close to a stop or vehicle, they can chat with other users at that stop or vehicle. Users can also report messages that are inappropriate.

## Technologies

| Technology                                    | Purpose         | Description                                                                                    |
| --------------------------------------------- | --------------- | ---------------------------------------------------------------------------------------------- |
| [Next.js](https://nextjs.org/)                | Framework       | Next.js is a React framework that allows for server-side rendering and static site generation. |
| [TypeScript](https://www.typescriptlang.org/) | Language        | TypeScript is a superset of JavaScript that adds static types to the language.                 |
| [MongoDB](https://www.mongodb.com/)           | Database        | MongoDB is a NoSQL database that stores data in JSON-like documents.                           |
| [Auth.js](https://authjs.dev/)                | Authentication  | Auth.js is a library that provides authentication for web applications.                        |
| [Shadcn/ui](https://ui.shadcn.com/)           | Styling         | Shadcn/ui is a React component library that provides styled components.                        |
| [Tailwind CSS](https://tailwindcss.com/)      | Styling         | Tailwind CSS is a utility-first CSS framework that provides pre-built styles.                  |
| [ESLint](https://eslint.org/)                 | Developer Tools | ESLint is a linter that statically analyzes code to find and fix problems.                     |
| [Prettier](https://prettier.io/)              | Developer Tools | Prettier is a code formatter that automatically formats code.                                  |
| [Husky](https://typicode.github.io/husky/)    | Developer Tools | Husky is a tool that allows for running scripts on Git hooks.                                  |

## Dev Setup

### Install dependencies

```bash
yarn install
```

### Run the development server

```bash
yarn dev
```

### Build for production

```bash
yarn build
```

### Run the production server

```bash
yarn start
```

### Lint

```bash
yarn lint
```

### Format

```bash
yarn format # Same as prettier:write
yarn prettier:check # check if the code is formatted
yarn prettier:write # format the code
```

### `.env`

```env
AUTH_SECRET="" # next-auth secret
MBTA_API_BASE_URL="https://api-v3.mbta.com" # mbta api base url
MBTA_API_KEY="" # your mbta api key
MONGODB_URI="" # your mongodb uri
AUTH_GITHUB_ID="" # your github id
AUTH_GITHUB_SECRET="" # your github secret
AUTH_GOOGLE_ID="" # your google id
AUTH_GOOGLE_SECRET="" # your google secret
```

# Features

## Chat History

- When a user sends a message, messages are saved in the chats collection with userId, chatId, and timestamp.
- When retriving chat history, all messages are retrieved and joins w/ user data
- Then messages are formatted and grouped by chat room (chatId)

## API Docs

### MBTA

> #### Get Array of Nearest Stops
>
> `GET` `/api/mbta/nearest-stops`
>
> _Requires Authentication_
>
> **Parameters**
> | Name | Required | Data Type | Description |
> | --- | --- | --- | --- |
> | lat | true | number | Latitude |
> | lon | true | number | Longitude |
> | acc | true | number | Accuracy _(in meters)_ |
>
> **Response**
>
> ```json
> [
>   {
>     "id": "WML-0442-CS",
>     "distance": 247,
>     "attributes": {
>       "name": "Worcester",
>       "description": "Worcester - Commuter Rail - Track 1 (All Trains)",
>       "latitude": 42.261835,
>       "longitude": -71.791806,
>       "location_type": 0,
>       "vehicle_type": 2,
>       ...
>     }
>   },
>   ...
> ]
> ```

> #### Get Array of Nearest Vehicles
>
> `GET` `/api/mbta/nearest-vehicles`
>
> _Requires Authentication_
>
> **Parameters**
> | Name | Required | Data Type | Description |
> | --- | --- | --- | --- |
> | lat | true | number | Latitude |
> | lon | true | number | Longitude |
> | acc | true | number | Accuracy _(in meters)_ |
>
> **Response**
>
> ```json
> [
>   {
>     "id": "1859",
>     "distance": 22555, // in meters
>     "attributes": {
>       "current_status": "IN_TRANSIT_TO",
>       "current_stop_sequence": 40,
>       "direction_id": 1,
>       "label": "1859",
>       "latitude": 42.2677116394043,
>       "longitude": -71.52082061767578,
>       "revenue": "REVENUE",
>       "speed": 10.3,
>       "updated_at": "2025-02-21T11:26:56-05:00",
>       ...
>     }
>   },
>   ...
> ]
> ```

### Chat

> #### Get User's Chat Messages
>
> `GET` `/api/chat`
>
> _Requires Authentication_
>
> **Response**
>
> ```json
> [
>   {
>     "chatId": "test",
>     "chatType": "stop",
>     "messages": [
>       {
>         "messageId": "67ba072a59f64d1a5a286bb8",
>         "message": "Wow that's pretty neat",
>         "reactions": {},
>         "timestamp": 1740244778845,
>         "user": {
>           "id": "67be4da06911c1b78d81a327",
>           "name": "Daniel",
>           "image": "https://avatars.githubusercontent.com/u/20031472?v=4"
>         }
>       },
>       {
>         "messageId": "67ba0e0f59f64d1a5a286bbb",
>         "message": "Yes, I am replying to my own message",
>         "reactions": { "❤️": 1 },
>         "replyId": "67ba072a59f64d1a5a286bb8",
>         "timestamp": 1740246543780,
>         "user": {
>           "id": "67be4da06911c1b78d81a327",
>           "name": "Daniel",
>           "image": "https://avatars.githubusercontent.com/u/20031472?v=4"
>         }
>       }
>     ]
>   }
> ]
> ```

> #### Get Chat Messages by Chat ID
>
> `GET` `/api/chat/<chatId>`
>
> _Requires Authentication_
>
> **Response**
>
> ```json
> {
>   "chatId": "test",
>   "chatType": "stop",
>   "messages": [
>     {
>       "messageId": "67ba072a59f64d1a5a286bb8",
>       "message": "Wow that's pretty neat",
>       "reactions": {},
>       "timestamp": 1740244778845,
>       "user": {
>         "id": "67be4da06911c1b78d81a327",
>         "name": "Daniel",
>         "image": "https://avatars.githubusercontent.com/u/20031472?v=4"
>       }
>     },
>     {
>       "messageId": "67ba0e0f59f64d1a5a286bbb",
>       "message": "Yes, I am replying to my own message",
>       "reactions": { "❤️": 1 },
>       "replyId": "67ba072a59f64d1a5a286bb8",
>       "timestamp": 1740246543780,
>       "user": {
>         "id": "67be4da06911c1b78d81a327",
>         "name": "Daniel",
>         "image": "https://avatars.githubusercontent.com/u/20031472?v=4"
>       }
>     }
>   ]
> }
> ```

> #### Send Chat Message
>
> `POST` `/api/chat`
>
> _Requires Authentication_
>
> **Body**
>
> ```json
> {
>   "chatId": "<vehicle/stop id>",
>   "chatType": "<vehicle | stop>",
>   "message": "Chat message..."
> }
> ```
>
> **Response**
>
> `200 OK`

> #### Send Chat Reply
>
> `POST` `/api/chat`
>
> _Requires Authentication_
>
> **Body**
>
> ```json
> {
>   "chatId": "<vehicle/stop id>",
>   "chatType": "<vehicle | stop>",
>   "message": "Chat message reply...",
>   "replyId": "<chat message id to reply to>"
> }
> ```
>
> **Response**
>
> `200 OK`

> #### Send Chat Reaction
>
> `POST` `/api/chat`
>
> _Requires Authentication_
>
> **Body**
>
> ```json
> {
>   "chatId": "<vehicle/stop id>",
>   "chatType": "<vehicle | stop>",
>   "reaction": "❤️",
>   "replyId": "<chat message id to react to>"
> }
> ```
>
> **Response**
>
> `200 OK`
