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
    const { order } = req.query;
    console.log('starting')
    const masterListPath = join(__dirname, '..',
      '..',
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
    console.log(masterListFile);
    const masterList = JSON.parse(masterListFile.toString());
    const orderData = masterList.list.orders.filter((x: any) => x.latin_name === order)
    console.log(orderData);
    res.status(200).json(orderData[0])
  } catch (error) {
    console.error(error)
    throw { message: 'Error' }
  }
}