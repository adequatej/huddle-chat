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
yarn prettier:check # check if the code is formatted
yarn prettier:write # format the code
```

## `.env`

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
