import Fuse from "fuse.js";

import { NextApiRequest, NextApiResponse } from 'next';
import { readdir, readFile } from 'fs/promises';
import { join } from 'path';
import { SimpleSpecies } from "../orders";

type ResponseError = {
  message: string
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any | ResponseError>
) {
  try {
    const { text } = req.query
    if (text) {
      const masterListPath = join(__dirname, '..',
        '..',
        '..',
        '..',
        '..',
        '..',
        '..',
        'data',
        'masterlists',
        'ioc_species.json'
      );
      const speciesFile = await readFile(masterListPath);
      const speciesList: SimpleSpecies[] = JSON.parse(speciesFile.toString());
      const options = {
        isCaseSensitive: false,
        includeScore: true,
        shouldSort: true,
        // includeMatches: false,
        // findAllMatches: false,
        // minMatchCharLength: 1,
        // location: 0,
        threshold: 0.2,
        // distance: 100,
        // useExtendedSearch: false,
        // ignoreLocation: false,
        // ignoreFieldNorm: false,
        // fieldNormWeight: 1,
        keys: [
          "order",
          "family",
          "genus",
          "species",
          "latin_name",
          "english_name"
        ]
      };

      const fuse = new Fuse(speciesList, options);

      // Change the pattern
      const results = fuse.search(text.toString())
      res.status(200).json(results)
    }
  } catch (error) {
    console.error(error)
    throw { message: 'Error' }
  }
}

