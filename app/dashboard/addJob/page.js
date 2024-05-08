"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function AddJob() {
  const router = useRouter();
  const [token, setToken] = useState("");
  const [lineData, setLineData] = useState([]);
  const [serverMessage, setServerMessage] = useState({
    flag: false,
    color: "red",
    message: "",
  });

  const [jobData, setJobData] = useState({
    lineName: "",
    startDate: "",
    totalPieces: undefined,
    piecesPerDay: undefined,
    color: "#ffffff",
    jobName: "",
    metadata: "",
  });

  useEffect(() => {
    let _token ;
    if (typeof localStorage !== "undefined") {
      _token = localStorage.getItem("user-data");
    }

    if (!_token) {
      console.error("User not logged in");
      router.push("/login");
    }
    _token = JSON.parse(_token).token;
    setToken(_token);

    fetch(`${process.env.NEXT_PUBLIC_SERVER_URI}/line`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${_token}`,
      },
    })
      .then((res) => res.json())
      .then((res) => {
        if (res.error) {
          if (res.message === "User not logged in") {
            router.push("/login");
          }
          console.log(res.message);
        } else {
          setLineData(res.data);
        }
      });
  }, []);

  function formSubmitHandler(e) {
    e.preventDefault();

    fetch(`${process.env.NEXT_PUBLIC_SERVER_URI}/jobs`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(jobData),
    })
      .then((res) => res.json())
      .then((res) => {
        if (res.error) {
          setServerMessage({
            flag: true,
            color: "red",
            message: res.message,
          });
        } else {
          router.push("/dashboard");
        }
      });
  }

  function formChangeHandler(attribute, value) {
    setJobData((prev) => ({
      ...prev,
      [attribute]: value,
    }));
  }

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h2 className="text-4xl font-bold text-black mb-6">Create new Job</h2>
      {serverMessage.flag && (
        <p className="text-red-500 font-bold mb-4">{serverMessage.message}</p>
      )}
      <form
        onSubmit={formSubmitHandler}
        className="p-6 mt-6 flex flex-col gap-3 justify-start border border-solid border-black rounded-lg w-96"
      >
        <input
          type="text"
          className="border border-solid border-gray-400 rounded-lg px-4 py-2 focus:outline-none focus:border-black"
          placeholder="Job name"
          value={jobData.jobName}
          onChange={(e) => formChangeHandler("jobName", e.target.value)}
        />
        <select
          className="border border-solid border-gray-400 rounded-lg px-4 py-2 focus:outline-none focus:border-black"
          value={jobData.lineName}
          onChange={(e) => formChangeHandler("lineName", e.target.value)}
        >
          <option value="" disabled>
            Select Line
          </option>
          {lineData.map((e, i) => (
            <option key={i} value={e.name}>
              {e.name}
            </option>
          ))}
        </select>
        <input
          type="date"
          className="border border-solid border-gray-400 rounded-lg px-4 py-2 focus:outline-none focus:border-black"
          placeholder="Start Date"
          value={jobData.startDate}
          onChange={(e) => formChangeHandler("startDate", e.target.value)}
        />
        <input
          type="number"
          className="border border-solid border-gray-400 rounded-lg px-4 py-2 focus:outline-none focus:border-black"
          placeholder="Total pieces"
          value={jobData.totalPieces}
          onChange={(e) => formChangeHandler("totalPieces", e.target.value)}
        />
        <input
          type="number"
          className="border border-solid border-gray-400 rounded-lg px-4 py-2 focus:outline-none focus:border-black"
          placeholder="Pieces per day"
          value={jobData.piecesPerDay}
          onChange={(e) => formChangeHandler("piecesPerDay", e.target.value)}
        />
        <div className="flex items-center gap-4">
          <label htmlFor="color" className="pr-2">
            Select a color for the job :
          </label>
          <input
            type="color"
            id="color"
            value={jobData.color}
            onChange={(e) => {
              formChangeHandler("color", e.target.value);
            }}
            className="w-20 h-10 shadow-md cursor-pointer"
          />
        </div>
        <textarea
          className="border border-solid border-gray-400 rounded-lg px-4 py-2 focus:outline-none focus:border-black resize-none"
          placeholder="Meta data for the job"
          value={jobData.metadata}
          onChange={(e) => formChangeHandler("metadata", e.target.value)}
        />
        <button
          type="submit"
          className="border border-solid border-black rounded-lg py-2 bg-black text-white hover:bg-gray-900 transition duration-300 focus:outline-none"
        >
          Save
        </button>
      </form>
    </div>
  );
}
