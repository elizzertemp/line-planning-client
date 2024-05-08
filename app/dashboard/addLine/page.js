"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function AddLine() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [metaData, setMetaData] = useState("");
  const [serverMessage, setServerMessage] = useState({
    flag: false,
    color: "red",
    message: "",
  });
  const [token, setToken] = useState("");

  useEffect(() => {
    let token;
    if (typeof localStorage !== "undefined") {
      token = localStorage.getItem("user-data");
    }
    if (!token) {
      console.log("[+]user not logged in");
      router.push("/login");
    }
    token = JSON.parse(token).token;
    setToken(token);
  }, []);

  function submitHandler(e) {
    e.preventDefault();
    let _body = {
      name: name,
      metadata: metaData,
    };

    fetch(`${process.env.NEXT_PUBLIC_SERVER_URI}/line`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(_body),
    })
      .then((res) => res.json())
      .then((res) => {
        if (res.error) {
          if (res.message === "User not logged in") {
            router.push("/login");
          }
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

  function setServerMessageToDefault() {
    setServerMessage({
      flag: false,
      color: "red",
      message: "",
    });
  }

  function nameHandler(e) {
    setServerMessageToDefault();
    setName(e.target.value);
  }

  function metadataHandler(e) {
    setServerMessageToDefault();
    setMetaData(e.target.value);
  }

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-3xl font-bold mb-6">Add New Line</h1>
      {serverMessage.flag && (
        <p className="text-red-500 font-bold mb-4">{serverMessage.message}</p>
      )}
      <form
        className="flex flex-col gap-6 items-center"
        onSubmit={submitHandler}
      >
        <input
          type="text"
          className="border-2 border-solid border-gray-400 rounded-lg px-4 py-2 w-80 focus:outline-none focus:border-black"
          placeholder="Line Name"
          value={name}
          onChange={nameHandler}
        />
        <textarea
          className="border-2 border-solid border-gray-400 rounded-lg px-4 py-2 w-80 h-40 focus:outline-none focus:border-black resize-none"
          placeholder="Meta Data"
          value={metaData}
          onChange={metadataHandler}
        />
        <button
          type="submit"
          className="bg-black text-white px-6 py-2 rounded-lg hover:bg-gray-900 transition duration-300 focus:outline-none"
        >
          Save
        </button>
      </form>
    </div>
  );
}
