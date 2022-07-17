import { NextApiRequest, NextApiResponse } from 'next';
import { readdir, writeFile, readFile } from 'fs/promises';
import { join } from 'path';

type ResponseError = {
  message: string
}

export interface SimpleSpecies {
  order: string;
  family: string
  genus: string;
  species: string;
  latin_name: string;
  english_name: string;
}

export const config = {
  api: {
    responseLimit: false,
  },
}

export default async function handler(
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
    console.log('masterList read')
    const orders = masterList.ioclist.list.order;

    const allSpecies: SimpleSpecies[] = [];

    const newOrders = orders.map((order: any) => {
      console.log('Order: ', order.latin_name);
      let families = [];
      if (Array.isArray(order.family)) {
        families = order.family;
      } else {
        families = [order.family]
      }

      order.families = families;
      delete order.family;
      order.families.map((family: any) => {
        console.log('   Family: ', family.latin_name);
        let genuses = [];
        if (Array.isArray(family.genus)) {
          genuses = family.genus;
        } else {
          genuses = [family.genus]
        }
        delete family.genus
        family.genuses = genuses;
        family.genuses.map((genus: any) => {
          console.log('       Genus: ', family.latin_name);
          let species = [];
          if (Array.isArray(genus.species)) {
            species = genus.species;
          } else {
            species = [genus.species]
          }
          genus.species = species;
          genus.species.map((species: any) => {
            console.log('           Species: ', species.latin_name);
            const simpleSpecies: SimpleSpecies = {
              order: order.latin_name,
              family: family.latin_name,
              genus: genus.latin_name,
              species: species.latin_name,
              latin_name: `${genus.latin_name} ${species.latin_name}`,
              english_name: species.english_name
            };

            allSpecies.push(simpleSpecies);
            if (species.subspecies) {
              species.subspecies.map((sub: any) => {
                console.log('               SubSpecies: ', sub.latin_name);
                if (sub.authority && sub.authority['#cdata-section']) {
                  sub.authority = sub.authority['#cdata-section'];
                }
                return sub;
              })
            }
            if (species.authority && species.authority['#cdata-section']) {
              species.authority = species.authority['#cdata-section'];
              console.log(species.authority);
            }
            return species;
          })
          return genus;
        })
        return family;
      })
      return order;
    })
    console.log('newOrders: ', newOrders.length);
    console.log('allSpecies: ', allSpecies.length);
    await writeFile('_ioclist.json', JSON.stringify(newOrders))
    await writeFile('_species.json', JSON.stringify(allSpecies))
    const newList = {
      list: "IOC",
      version: '12.1',
      orders: newOrders,
    };
    console.log('newList: ', newList);
    res.status(200).json(newList);
    console.log('done')
  } catch (error) {
    console.error(error)
    throw { message: 'Error' }
  }
}