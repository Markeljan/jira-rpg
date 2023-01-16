# jira-rpg

Jira RPG is a game app that combines Jira tasks with role-playing gameplay. Players progress through the game by completing tasks assigned to them in Jira. The app seamlessly integrates with Jira, allowing players to manage their real-world tasks in an interactive and engaging way. Perfect for boosting productivity and having fun at the same time.


![Screenshot 2023-01-15 at 11 30 28 PM](https://user-images.githubusercontent.com/12901349/212600900-97a9ffff-6c0b-4616-aed7-ae091ae3e79a.png)


## Inspiration
The inspiration for Jira RPG came from a desire to make work tasks more engaging and interactive. We wanted to create a way for people to not only manage their real-world tasks, but also have fun while doing it.

## What it does
Jira RPG is a game app that combines Jira tasks with role-playing gameplay. Players progress through the game by completing tasks assigned to them in Jira. The app seamlessly integrates with Jira, allowing players to manage their real-world tasks in an interactive and engaging way.

## How we built it
We built Jira RPG using kaboom.js and forge. We used kaboom.js to handle the game mechanics and user interactions, and forge to integrate with Jira and deploy the app.

## Challenges we ran into
One of the main challenges we ran into was getting used to the new development environment. We had to learn how to use kaboom.js and forge, which took some time and effort.

## Accomplishments that we're proud of
We are proud of successfully integrating Jira with our game app and creating a seamless experience for the user. We are also proud of the fun and engaging gameplay that we have created.

## What we learned
We learned that forge is a great tool for deploying full stack apps with Atlassian products. We also learned that kaboom.js is a powerful framework for building game mechanics and user interactions.

## What's next for Jira RPG
We see Jira RPG as having a lot of potential for further development. Some ideas for future development include leaderboards, more complexity in the Roguelike gameplay, and reward systems. With further development, Jira RPG could become a valuable tool for boosting productivity and having fun at the same time.

## Requirements

See [Set up Forge](https://developer.atlassian.com/platform/forge/set-up-forge/) for instructions to get set up.

## Quick start

- Install top-level dependencies:

```
npm install
```

- Install dependencies (inside of the `static/game` directory):

```
npm install
```

- Modify your app by editing the files in `static/game/src/`.

- Build your app (inside of the `static/game` directory):

```
npm run build
```

- Deploy your app by running:

```
forge deploy
```

- Install your app in an Atlassian site by running:

```
forge install
```

### Notes

- Use the `forge deploy` command when you want to persist code changes.
- Use the `forge install` command when you want to install the app on a new site.
- Once the app is installed on a site, the site picks up the new app changes you deploy without needing to rerun the install command.

## Support

See [Get help](https://developer.atlassian.com/platform/forge/get-help/) for how to get help and provide feedback.
