export const getRouterBasename = () => {
  const path = window.location.pathname;
  const match = path.match(/^(\/app\/[^\/]+\/preview)/);
  return match ? match[1] : '';
};