'use client'

import { useRouter } from 'next/navigation'

export default function Home() {
  const router=useRouter()
  if (typeof localStorage !== "undefined") {
  if(localStorage.getItem("user-data")){
    router.push("/dashboard")
  }else{
    router.push("/login")
  }}
  return(
    <div>This is home page</div>
  )
}
