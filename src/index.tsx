import Resolver from "@forge/resolver";

const resolver = new Resolver();

resolver.define("exampleFunctionKey", ({ payload, context }) => {
  return { example: `Hello, ${payload.name}!` };
});

export const handler = resolver.getDefinitions();
