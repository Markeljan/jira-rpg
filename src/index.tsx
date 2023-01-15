import Resolver from "@forge/resolver";

const resolver = new Resolver();

resolver.define("getText", (req) => {
  console.log(req);

  return "Hello world!";
});

export const handler = resolver.getDefinitions();

export const handleIssueCreated = async (event) => {
  console.log(event.issue.id);
};
