import { readdir } from "fs/promises";
import { useRouter } from "next/router";
import { join } from "path";
import { useEffect, useState } from "react";
import useSWR from "swr";

const fetcher = async (url: string) => {
  try {
    const res = await fetch(url);
    const data = await res.json();
    console.log('fetcher:', data.list.orders);
    return data.list.orders;
  } catch (error) {
    console.error(error)
    throw error;
  }
};

export default function Orders() {
  const { data, error } = useSWR(`/api/dataValidator`, fetcher);
  const [orders, setOrders] = useState([])

  useEffect(() => {
    console.log('data:', data)
    if (data && data.length > 0) {
      setOrders(data)
    }
  }, [data])


  return (
    <div className="flex flex-col items-center">
      <div className="m-2 flex flex-col justify-start items-center md:w-10/12">
        <h1 className="text-xl mb-4 w-full">Orders</h1>
        {
          error ? (
            <p>An Error Occurred</p>
          ) : null
        }

        <table className="">
          <tbody>
            {orders.map((order: any, i: number) => {
              return <tr key={i} className="hover:bg-gray-100 h-20 rounded">
                <td className="p-2">{order.latin_name}</td>
                <td className="p-2">{order.note}</td>
              </tr>
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}

