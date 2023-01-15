import api, { route } from "@forge/api";

export const getText = async () => {
  const response = await api.asApp().requestConfluence(route`/content/12345`);
  return response;
};
