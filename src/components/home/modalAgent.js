"use client"
import { Modal,Header,Body } from "../ui/modal";
export default function ModalAgent({show,setShow,setAgent}) {
    const handleAgent=function(agent){
        setAgent(agent)
        setShow(false);
    }
  return (
    <Modal show={show}>
      <Header>
        <h2 className="text-lg font-bold">Choose AI Agent</h2>
          <button
              onClick={() => setShow(false)}
              className="px-4 bg-red-500 text-white rounded-lg"
          >
              Close
          </button>
      </Header>
      <Body>
        <div type="button" onClick={()=>{handleAgent('jamal')}} className="rounded border p-2 my-2 border-gray-700 hover:bg-gray-200 cursor-pointer">
            <div className="font-bold text-lg">
                Jamal
            </div>
            <div className="text-sm">
                this is the description
            </div>
        </div>
        <div type="button" onClick={()=>{handleAgent('dobleh')}} className="rounded border p-2 my-2 border-gray-700 hover:bg-gray-200 cursor-pointer">
            <div className="font-bold text-lg">
                dobleh
            </div>
            <div className="text-sm">
                this is the description
            </div>
        </div>
        <div type="button" onClick={()=>{handleAgent('Kabur')}} className="rounded border p-2 my-2 border-gray-700 hover:bg-gray-200 cursor-pointer">
            <div className="font-bold text-lg">
                Kabur
            </div>
            <div className="text-sm">
                this is the description
            </div>
        </div>
      </Body>
    </Modal>
  );
}