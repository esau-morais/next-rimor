import React from "react";
import Image from "next/image";

const shimmer = (w: number, h: number) => `
<svg width="${w}" height="${h}" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
  <defs>
    <linearGradient id="g">
      <stop stop-color="#333" offset="20%" />
      <stop stop-color="#222" offset="50%" />
      <stop stop-color="#333" offset="70%" />
    </linearGradient>
  </defs>
  <rect width="${w}" height="${h}" fill="#333" />
  <rect id="r" width="${w}" height="${h}" fill="url(#g)" />
  <animate xlink:href="#r" attributeName="x" from="-${w}" to="${w}" dur="1s" repeatCount="indefinite"  />
</svg>`;

const toBase64 = (str: string) =>
  typeof window === "undefined"
    ? Buffer.from(str).toString("base64")
    : window.btoa(str);

export default function Characters({ characters }: any) {
  return (
    <div className="flex flex-wrap justify-center gap-4">
      {characters?.map((character: any) => (
        <div key={character.id}>
          <Image
            className="rounded-lg"
            src={character.image}
            alt={character.name}
            blurDataURL={`data:image/svg+xml;base64,${toBase64(
              shimmer(700, 475)
            )}`}
            placeholder="blur"
            width={"300"}
            height={"300"}
          />
          <h2 className="text-lg font-medium">{character.name}</h2>
          <div className="flex items-center space-x-2 max-w-[14rem]">
            <span>{character.origin.name}</span>
            <span>&#183;</span>
            <span>{character.location.name}</span>
          </div>
        </div>
      ))}
    </div>
  );
}
