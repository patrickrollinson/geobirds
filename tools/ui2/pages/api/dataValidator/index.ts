import { NextApiRequest, NextApiResponse } from 'next';
import { readdir, readFile } from 'fs/promises';
import { join } from 'path';

type ResponseError = {
  message: string
}

export default async function personHandler(
  req: NextApiRequest,
  res: NextApiResponse<any | ResponseError>
) {
  try {
    console.log('starting')
    const masterListPath = join(__dirname, '..',
      '..',
      '..',
      '..',
      '..',
      '..',
      'data',
      'masterlists',
      'ioc.json'
    );
    const masterListFile = await readFile(masterListPath);
    const masterList = JSON.parse(masterListFile.toString());
    console.log(masterList);
    res.status(200).json(masterList)
  } catch (error) {
    console.error(error)
    throw { message: 'Error' }
  }
}