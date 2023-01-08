import { parseDidUrl } from "./parseDidUrl";

export const dereferenceWithinDocument = <U>({
  id,
  document,
}: // eslint-disable-next-line @typescript-eslint/no-explicit-any
any): U | null => {
  if (!document) {
    throw new Error("Document is null");
  }
  const { fragment } = parseDidUrl(id);
  const bucket = [
    ...(document.verificationMethod || []),
    ...(document.service || []),
  ];
  const item = bucket.find((item: { id: string }) => {
    return item.id === id || item.id === `#${fragment}`;
  });
  return item ? item : null;
};
