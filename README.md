# toilet-paper-app

[Rough spec](https://excalidraw.com/#json=5185613305217024,Or41kGO8gujpVcdLs6KDww): UI not to scale (+ lots of artistic license)

## Project structure

- This is a react app built with the create-react-app scaffolding
  - Using react-router for navigation ([docs](https://reacttraining.com/react-router/web/guides/quick-start))
- Using bootstrap (with the react-bootsrap package) basic css styling
  - For UI changes, use [these docs](https://react-bootstrap.netlify.com/components/alerts) for components etc that bootstrap gives out of the box
- Integration with google maps and google sheets as database (sheets to be built out)

## Usage

The app requires Node.js to be installed locally. Once you have Node, run the following from the project directory. This would setup the local dev server on http://localhost:3000.

```
npm install
npm start
```

Strictly optional: setup Prettier in your editor for code formatting.

## Deployments

We have continuous deployment on every push to `master` with a Netlify integration. Give a minute or two for the changes to deploy after a push.

The app is deployed at https://peaceful-rosalind-47c3e2.netlify.com

## Google sheets integration

The sheet is at https://docs.google.com/spreadsheets/d/1jFQrYwbhPIaRL6t4TnpTO7W905U0B-W1FXS-GBYwz7M/edit#gid=0

- The app depends on the column names and sheet ordering for now
- If any of these need to be changed, remember to update the code (the react app only), including:
  - Submit form `onSubmit`
  - "Share your experience" flow from home page to submit
  - Showing results in `ResultBlock`
- Column ordering can be changed without code changes - it will require a server restart
  - So that the cached `header row` is deleted

## Location input - test scenarios

1. "Update info" flow from homepage -> submit.
2. Type on search field on submit
3. Drag marker
4. Drag map (marker stays in the center; "mobile friendly drag")

## Contribute

Let's push directly to master for now, and use the group chat / issues for coordination.

## Formatting

```
npx prettier --write --trailing-comma none --arrow-parens avoid src/**/*.js
```
