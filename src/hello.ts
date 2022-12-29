export const hello = () => {
  const message = "hello 2";
  const encoded = new TextEncoder().encode(message);
  console.log(encoded);
  return "world";
};
