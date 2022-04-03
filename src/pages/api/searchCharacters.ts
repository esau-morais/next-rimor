import { gql } from "@apollo/client";
import { NextApiRequest, NextApiResponse } from "next";
import { client } from "../../lib/apollo";

// eslint-disable-next-line import/no-anonymous-default-export
export default async (req: NextApiRequest, res: NextApiResponse) => {
  const query = req.body;
  try {
    const { data } = await client.query({
      query: gql`
        query {
          characters(filter: { name: "${query}" }) {
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

    res.status(200).json({ characters: data.characters.results, error: null });
  } catch (error: any) {
    if (error.message === "404: Not Found") {
      res.status(404).json({
        characters: null,
        error: `No characters with name ${query} found`,
      });
    } else {
      res.status(500).json({
        characters: null,
        error: "Internal Error, please try again",
      });
    }
  }
};
