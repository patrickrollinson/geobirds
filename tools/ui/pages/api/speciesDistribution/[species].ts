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
    console.log('speciesDistName: ', speciesName)
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
    const filtered = speciesList.filter((species: SimpleSpecies) => species.latin_name === speciesName);
    if (filtered && filtered.length > 0) {
      const species = filtered[0];
      const speciesDistributionPath = join(__dirname, '..',
        '..',
        '..',
        '..',
        '..',
        '..',
        '..',
        'data',
        'distributions',
        `${species.order.toLowerCase()}`,
        `${species.family.toLowerCase()}`,
        `${species.genus.toLowerCase()}`,
        `${species.genus.toLowerCase()}_${species.species.toLowerCase()}.geojson`
      );
      const speciesDistributionFile = await readFile(speciesDistributionPath);
      const speciesDistribution: SimpleSpecies[] = JSON.parse(speciesDistributionFile.toString());
      res.status(200).json(speciesDistribution)
    }


  } catch (error) {
    console.error(error)
    throw { message: 'Error' }
  }
}

