import React, { Suspense } from "react";
import { gql } from "@apollo/client";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import Head from "next/head";
import { ChangeEvent, useEffect, useRef, useState } from "react";
import { client } from "../lib/apollo";
import dynamic from "next/dynamic";
const Characters = dynamic(() => import("../layouts/Characters"), {
  suspense: true,
});

export default function Home(
  results: InferGetServerSidePropsType<GetServerSideProps>
) {
  const defaultCharactersResult = results;
  const [characters, setCharacters] = useState(
    defaultCharactersResult.characters
  );
  const [search, setSearch] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // focus input element as soon as it's mounted
    if (inputRef.current) inputRef.current.focus();
  }, []);

  const handleSearchCharactersOnSubmit = async (
    e: ChangeEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    const results = await fetch("/api/searchCharacters", {
      method: "post",
      body: search,
    });
    const { characters, error } = await results.json();

    if (error) {
      alert(`Error ocurred: ${error}`);
    } else {
      setCharacters(characters);
    }
  };
  return (
    <>
      <Head>
        <title>Rick and Morty World</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="w-full">
        <h1 className="mb-4 text-4xl font-bold text-center">
          Rick and Morty World
        </h1>
        <form
          className="flex flex-col items-center mb-8 just"
          onSubmit={handleSearchCharactersOnSubmit}
        >
          <div className="relative">
            <div>
              <input
                type="text"
                className="p-2 pl-8 bg-gray-200 border border-gray-200 rounded-l-lg focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                placeholder="Search by name"
                ref={inputRef}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <svg
                className="w-4 h-4 absolute left-2.5 top-3.5"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
              <button
                className="p-[9px] text-white bg-purple-600 hover:bg-purple-600/90 transition-colors rounded-r-lg"
                type="submit"
                disabled={search === ""}
              >
                Search
              </button>
            </div>

            <button
              className="mt-2 cursor-pointer"
              type="submit"
              disabled={search === ""}
              onClick={() => {
                setSearch("");
                setCharacters(defaultCharactersResult.characters);
              }}
            >
              Clear
            </button>
          </div>
        </form>
        <Suspense fallback={(<div className="animate-pulse">Loading...</div>)}>
          <Characters characters={characters} />
        </Suspense>
      </div>
    </>
  );
}

export async function getStaticProps() {
  const { data } = await client.query({
    query: gql`
      query {
        characters(page: 1) {
          info {
            count
            pages
          }
          results {
            id
            name
            image
            location {
              id
              name
            }
            origin {
              id
              name
            }
            episode {
              id
              episode
              air_date
            }
          }
        }
      }
    `,
  });

  return {
    props: {
      characters: data.characters.results,
    },
  };
}