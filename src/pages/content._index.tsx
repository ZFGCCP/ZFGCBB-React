export const loader = () => {
  throw new Response("Not Found", { status: 404 });
};

export const clientLoader = () => {
  throw new Response("Not Found", { status: 404 });
};
