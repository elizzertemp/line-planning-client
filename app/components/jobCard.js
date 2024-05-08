'use client'

import { useRouter } from "next/navigation";

export default function JobCard(props) {
  const startDate = new Date(props.data.startDate);
  const endDate = new Date(props.data.endDate);
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const router = useRouter();

  function jobDeleteHandler() {
    let _token ;

    if (typeof localStorage !== "undefined") {
      _token= localStorage.getItem("user-data")
    }


    if (!_token) {
      console.error("User not logged in");
      router.push("/login");
    }
    _token = JSON.parse(_token).token;

    fetch(`${process.env.NEXT_PUBLIC_SERVER_URI}/jobs/${props.data._id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${_token}`,
      },
    })
      .then((res) => res.json())
      .then((res) => {
        if (res.error) {
          console.log(res.message);
        } else {
          props.refresh();
        }
      });
  }

  return (
    <div className={` text-black rounded-lg border-2 border-solid border-orange-900 p-4 w-4/5`} style={{ backgroundColor: `${props.data.color}` }}>
      <div className="text-lg font-bold text-center">{props.data.jobName}</div>
      <hr />
      <div className="pt-2 pb-2 px-10">
        <div className="flex justify-between">
          <div>
            <span className="font-bold">Start Date:</span>{" "}
            {`${days[startDate.getDay()]}, ${startDate.getDate()}-${startDate.getMonth() + 1}-${startDate.getFullYear()}`}
          </div>
          <div>
            <span className="font-bold">End Date:</span>{" "}
            {`${days[endDate.getDay()]}, ${endDate.getDate()}-${endDate.getMonth() + 1}-${endDate.getFullYear()}`}
          </div>
        </div>
        <div className="flex justify-between pt-3">
          <div>
            <span className="font-bold">Total Pieces:</span> {props.data.totalPieces}
          </div>
          <div>
            <span className="font-bold">Pieces Per Day:</span> {props.data.piecesPerDay}
          </div>
          <div>
            <span className="font-bold">Number of Days:</span> {props.data.noOfDays}
          </div>
        </div>
        <div className="pt-5">
          <span className="font-bold">Metadata:</span> {props.data.metaData}
        </div>
      </div>
      <hr />
      <div className="flex justify-evenly pt-3">
        <div>
          <button className=" border border-solid  py-3 px-5 rounded-lg">Edit</button>
        </div>
        <div>
          <button className=" border border-solid py-3 px-5 rounded-lg" onClick={jobDeleteHandler}>Delete</button>
        </div>
      </div>
    </div>
  );
}

