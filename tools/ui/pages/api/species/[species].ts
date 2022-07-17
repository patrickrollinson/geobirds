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
    const speciesName = req.query.species;
    console.log('speciesName: ', speciesName)
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
    const filtered = speciesList.filter((species) => species.latin_name === speciesName)
    res.status(200).json(filtered[0])
  } catch (error) {
    console.error(error)
    throw { message: 'Error' }
  }
}

