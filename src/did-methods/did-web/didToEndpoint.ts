export const didToEndpoint = (did: string) => {
  const regex = new RegExp(
    `did:web:(?<host>[a-zA-Z0-9/.\\-_]+)(?:%3A(?<port>[0-9]+))?(:*)(?<path>[a-zA-Z0-9/.:\\-_]*)`
  );
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const match: any = did.match(regex);
  if (!match) {
    throw new Error("DID is not a valid did:web");
  }
  const { host, port, path } = match.groups;
  const origin = port ? `${host}:${port}` : `${host}`;
  const protocol = host.includes("localhost") ? "http" : "https";
  const decodedPartialPath = path.split(":").join("/");
  const endpoint = path
    ? `${protocol}://${origin}/${decodedPartialPath}/did.json`
    : `${protocol}://${origin}/.well-known/did.json`;
  return endpoint;
};
