import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react'
import useSWR from 'swr';

const fetcher = async (url: string) => {
  try {
    const res = await fetch(url);
    const data = await res.json();
    console.log('fetcher:', data);
    return data;
  } catch (error) {
    console.error(error)
    throw error;
  }
};

function Order() {
  const router = useRouter()
  const { order } = router.query;
  const { data, error } = useSWR(() => order && `/api/order/${order}`, fetcher);
  const [orderData, setOrderData] = useState<any | null>(null)
  const [families, setFamilies] = useState([])
  const [genuses, setGenuses] = useState<any[]>([])
  const [species, setSpecies] = useState<any[]>([])
  useEffect(() => {
    if (data) {
      setOrderData(data)
      setFamilies(data.family)
      const tempGenuses: any[] = []
      data.family.map((family: any) => {
        console.log(family)
        if (Array.isArray(family.genus)) {
          family.genus.map((genus: any) => {
            tempGenuses.push(genus)
          })
        } else {
          tempGenuses.push(family.genus)
        }
      })
      setGenuses(tempGenuses);

    }
  }, [data])

  useEffect(() => {
    const tempSpecies: any[] = []
    genuses.map((genus) => {
      if (Array.isArray(genus.species)) {
        genus.species.map((species: any) => {
          tempSpecies.push(species)
        })
      } else {
        tempSpecies.push(genus.species)
      }
    })
    setSpecies(tempSpecies)
  }, [genuses])


  return (
    <div className='m-4'>
      <h1 className='text-2xl mb-4'>Order: {order}</h1>
      {orderData ? (<div>

        <p className='text-base'>{orderData.note}</p>
        <div className='mt-4'>
          <h2 className='text-xl'>Families</h2>
          <table className="w-full">
            <tbody>
              {families.map((family: any, i: number) => {
                return (
                  <Link key={i} href={`family/${family.latin_name}`}>
                    <tr className="hover:bg-gray-100 h-10 rounded">
                      <td className="p-2">{family.latin_name}</td>
                      <td className="p-2">{family.english_name}</td>
                    </tr>
                  </Link>
                )
              })}
            </tbody>
          </table>
        </div>
        <div className='mt-4'>
          <h2 className='text-xl'>Genus</h2>
          <table className="w-full">
            <tbody>
              {genuses.map((genus: any, i: number) => {
                return (
                  <Link key={i} href={`genus/${genus.latin_name}`}>
                    <tr className="hover:bg-gray-100 h-10 rounded">
                      <td className="p-2">{genus.latin_name}</td>
                      <td className="p-2">{genus.english_name}</td>
                    </tr>
                  </Link>
                )
              })}
            </tbody>
          </table>
        </div>
        <div className='mt-4'>
          <h2 className='text-xl'>Species</h2>
          <table className="w-full">
            <tbody>
              {species.map((s: any, i: number) => {
                return (
                  <Link key={i} href={`genus/${s.latin_name}`}>
                    <tr className="hover:bg-gray-100 h-10 rounded">
                      <td className="p-2">{s.latin_name}</td>
                      <td className="p-2">{s.english_name}</td>
                    </tr>
                  </Link>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>) : null}
    </div>
  )
}

export default Order