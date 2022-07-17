import { readdir } from "fs/promises";
import Link from "next/link";
import { useRouter } from "next/router";
import { join } from "path";
import { useEffect, useState } from "react";
import useSWR, { useSWRConfig } from "swr";

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

export default function Search() {
  const [getResults, setGetResults] = useState(false)
  const [searchString, setSearchString] = useState('')
  const { data, error } = useSWR(getResults ? `/api/search/${searchString}` : null, fetcher);
  const [results, setResults] = useState([])


  useEffect(() => {
    console.log('data:', data)
    if (data) {
      setResults(data)
    }
  }, [data])

  const search = async () => {
    console.log('searching: ', searchString)
    setGetResults(true);
  }


  return (
    <div className="flex flex-col items-center w-full">
      <div className="m-2 flex flex-col justify-start items-start max-w-[80%]">
        <h1 className="text-2xl mb-4 w-full">Search</h1>
        <div className="flex flex-row gap-2 w-full p-2 border rounded-lg">

          <input
            className="w-full p-2"
            type={'text'}
            placeholder='Search'
            value={searchString}
            onChange={(e) => setSearchString(e.target.value)}
          />
          <button
            className="rounded bg-blue-400 h-12 w-32 "
            onClick={() => search()}
          >
            Search
          </button>
        </div>

        {results.length > 0 ? (
          <h2 className="text-xl my-4">Results ({results.length})</h2>
        ) : null}
        <table className="w-full ">
          <tbody>
            {results.map((result: any, i: number) => {
              return (
                <Link key={i} href={`species/${result.item.latin_name}`}>
                  <tr className="hover:bg-gray-100 h-20 rounded-lg border">
                    <td className="p-2">{result.item.english_name}</td>
                    <td className="p-2">{result.item.latin_name}</td>
                  </tr>
                </Link>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}

