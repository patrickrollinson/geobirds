import React, { useEffect, useState } from 'react'
import dynamic from "next/dynamic"
import useSWR from 'swr'
import { useRouter } from 'next/router';

const fetcher = async (url: string) => {
  try {
    const res = await fetch(url);
    const data = await res.json();
    return data;
  } catch (error) {
    console.error(error)
    throw error;
  }
};

function Species() {
  const router = useRouter()
  const { species } = router.query;
  const speciesData = useSWR(species ? `/api/species/${species}` : null, fetcher);
  const [geojson, setGeojson] = useState<null | any>(null)
  const speciesDistribution = useSWR(species ? `/api/speciesDistribution/${species}` : null, fetcher);
  const SpeciesMap = dynamic(() => import("../../components/speciesMap"), { ssr: false })

  useEffect(() => {
    if (speciesData.data) {
      console.log('speciesData: ', speciesData.data);
    }
  }, [speciesData])

  useEffect(() => {
    if (speciesDistribution.data) {
      console.log('speciesDistribution: ', speciesDistribution.data)
      setGeojson(speciesDistribution.data)
    }
  }, [speciesDistribution])

  return (
    <div className='flex flex-col justify-start items-start w-full'>
      <div className='w-full h-24'>
        <h1 className='text-xl p-4'> {species}</h1>
      </div>
      <div className='flex flex-row justify-start items-start w-full'>
        <div className='h-screen border border-red-500 w-8/12'>
          <SpeciesMap geojson={geojson} englishName={speciesData.data.english_name} latinName={speciesData.data.latin_name} />
        </div>
        <div className='border border-blue-400 h-screen w-4/12'>
          <table>
            <tbody>
              {geojson.features.map((feature: any, i: number) => {
                return (
                  <tr key={i}>
                    <td>
                      {feature?.properties?.type.toUpperCase()}
                    </td>
                    <td>

                    </td>
                  </tr>
                )

              }
              )}
            </tbody>
          </table>
        </div>

      </div>
    </div>
  )
}

export default Species