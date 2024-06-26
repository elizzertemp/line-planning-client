'use client'

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import LineCard from "../components/lineCard";

export default function Dashboard() {
  const router = useRouter();

  const [lineData, setLineData] = useState([]);
  const [loading, setLoading] = useState(true);
  let token;

  useEffect(() => {
    if (typeof localStorage !== "undefined") {
    token = localStorage.getItem("user-data");
    }
    if (!token) {
      console.log("[+]user not logged in");
      router.push("/login");
    }
    token = JSON.parse(token).token;
    // console.log(JSON.parse(token))

    fetch(`${process.env.NEXT_PUBLIC_SERVER_URI}/line`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((res) => {
        if (res.error) {
          console.error(res.message);
          if (res.message === "User not logged in") {
            router.push("/login");
          }
        } else {
          console.log(res.data);
          setLineData(res.data);
          setLoading(false); // Set loading to false after fetching data
        }
      });
  }, []);

  function line(lineId){
    console.log('[+]',lineId)
    router.push(`/dashboard/${lineId}`)
  }

  return (
      <div className="p-4">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {/* Render Line Cards */}
          {lineData.map((e, i) => {
            return <LineCard data={e} key={i} onClick={()=>{line(e._id)}}></LineCard>;
          })}
        </div>
      </div>
    
  );
}
