"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Login() {
  const router = useRouter();

  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [userNameError, setUserNameError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [serverMessage, setServerMessage] = useState("");

  function loginHandler(e) {
    e.preventDefault();

    // Reset error messages
    setUserNameError("");
    setPasswordError("");
    setServerMessage("");

    // Validate username
    if (!userName) {
      setUserNameError("Username is required");
      return;
    }

    // Validate password
    if (!password) {
      setPasswordError("Password is required");
      return;
    }

    // Send login request
    const userCreds = {
      username: userName,
      password: password,
    };
    fetch(`${process.env.NEXT_PUBLIC_SERVER_URI}/user/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userCreds),
    })
      .then((res) => res.json())
      .then((res) => {
        if (res.error) {
          setServerMessage(res.message);
        } else {
          window.localStorage.setItem("user-data", JSON.stringify(res.data));
          router.push("/dashboard");
        }
      })
      .catch((error) => {
        console.error("Login error:", error);
        setServerMessage("An unexpected error occurred");
      });
  }

  return (
    <div className="h-screen flex flex-col justify-center items-center bg-gray-100">
      <h1 className="text-3xl font-bold text-center mb-6 text-black">
        Just Login and start planning
      </h1>
      {serverMessage && (
        <p className="text-red-600 text-center font-bold">{serverMessage}</p>
      )}
      <form onSubmit={loginHandler} className="flex flex-col gap-4">
        <input
          type="text"
          placeholder="Username"
          className={`p-3 rounded-lg ${userNameError ? "border-red-500" : "border-gray-300 focus:border-black"}`}
          onChange={(e) => setUserName(e.target.value)}
          value={userName}
        />
        {userNameError && (
          <p className="text-red-500 text-sm">{userNameError}</p>
        )}
        <input
          type="password"
          placeholder="Password"
          className={`p-3 rounded-lg ${passwordError ? "border-red-500" : "border-gray-300 focus:border-black"}`}
          onChange={(e) => setPassword(e.target.value)}
          value={password}
        />
        {passwordError && (
          <p className="text-red-500 text-sm">{passwordError}</p>
        )}
        <button
          type="submit"
          className="bg-black px-5 py-2 rounded-lg hover:shadow-lg text-white"
        >
          Login
        </button>
      </form>
    </div>
  );
}
