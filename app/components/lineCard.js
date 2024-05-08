import { useRouter } from "next/navigation";

export default function lineCard(props) {

const router = useRouter()

  function lineSelectHandler() {
    router.push(`/dashboard/${props.data._id}`)
  }

  return (
    <div
      className="bg-white-400 p-3 border border-solid border-3 border-black  rounded-lg cursor-pointer"
      onClick={lineSelectHandler}
    >
      <div>
        <h3 className="text-left">
          {" "}
          Line Name: <span className="font-bold">{props.data.name}</span>{" "}
        </h3>
      </div>
      <hr />
      <div>
        <div className="whitespace-normal">
          <div className="flex">
            <h3 className="font-bold">Meta data : </h3>
            <span>{props.data.metadata}</span>
          </div>
        </div>
      </div>
    </div>
  );
}