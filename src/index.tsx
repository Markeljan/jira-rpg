import Resolver from "@forge/resolver";

const resolver = new Resolver();

resolver.define("exampleFunctionKey", ({ payload, context }) => {
  return { example: `Hello, ${payload.name}!` };
});

export const handler = resolver.getDefinitions();

export const issueCreatedHandler = async (event, context) => {
  console.log("Issue created");
  console.log(event);
};
