"use client";

import { useEffect, useState } from "react";
import JobCard from "../../components/jobCard";
import { useRouter } from "next/navigation";

export default function LineExpand({ params }) {
  const router = useRouter();
  const lineId = params.lineId;
  const [jobsList, setJobsList] = useState([]);
  const [lineData, setLineData] = useState({ name: "" });
  const [loading, setLoading] = useState(true);
  const [refresh, setRefresh] = useState(false);

  useEffect(() => {
    let token = window.localStorage.getItem("user-data");
    if (!token) {
      console.log("[+]user not logged in");
      router.push("/login");
    }
    token = JSON.parse(token).token;

    // Fetch line data
    fetch(`${process.env.NEXT_PUBLIC_SERVER_URI}/line/${lineId}`, {
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
          if (res.data && res.data.length > 0) {
            setLineData(res.data[0]);
          }
          setLoading(false);
        }
      });

    // Fetch jobs data
    fetch(`${process.env.NEXT_PUBLIC_SERVER_URI}/jobs/${lineId}`, {
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
          setJobsList(res.data);
        }
      });
  }, [refresh]);


  function pageRefresh() {
    setRefresh((prev) => !prev);
  }

 

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="w-screen overflow-auto">
        <div className="w-full flex justify-between items-center font-bold text-black bg-white p-3">
          <div className="fixed m-3 mt-10 font-bold text-3xl ">
            <span>Line No:</span> {lineData.name}
          </div>
          {/* Add other components or buttons if needed */}
        </div>
        {!loading && (
          <div className="flex flex-col items-center gap-3 m-2">
            {jobsList.map((e, i) => {
              return <JobCard data={e} refresh={pageRefresh} key={i} />;
            })}
          </div>
        )}
      </div>
    </div>
  );
  
}
