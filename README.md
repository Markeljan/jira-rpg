# jira-rpg

Jira RPG is a game app that combines Jira tasks with role-playing gameplay. Players progress through the game by completing tasks assigned to them in Jira. The app seamlessly integrates with Jira, allowing players to manage their real-world tasks in an interactive and engaging way. Perfect for boosting productivity and having fun at the same time.

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
