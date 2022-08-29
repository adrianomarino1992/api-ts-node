import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import axios from "axios";

const state = {
  Id: 0,
  Title: "",
  Description: "",
  Date: new Date(),
  Owner: {},
  Participants : []
};

const ViewEvent = () => {
  const { id } = useParams();

  var navigate = useNavigate();

  state.Id = id;
   
  var [event, setEvent] = useState(state);
  var [persons, setPersons] = useState([]);
  var [parts, setParts] = useState([]);
  
  useEffect(() => {
    (async () => {
      try {

        if(event.Id > 0){
          var result  = await axios.get('http://localhost:1244/events/getbyid', 
          {        
              params: {
                  id :  event.Id
              },
              headers: {
                  myKey : "key"
              }
              
          });
          
          if(result.status === 200)
          {             
              
              setEvent(result.data[0]);  
              setParts(result.data[0].Participants.map((s, i) => {return {PersonId:  s.PersonId, EventId : s.EventId}}));
          }else{

              toast("Error in the request to the server")
          }
      }
       
          var result = await axios.get("http://localhost:1244/persons/getAll", {
            headers: {
              myKey: "key",
            },
          });

          if (result.status === 200) {
            
            setPersons(result.data);
          } else {
            toast("Error in the request to the server");
          }
        
      } catch (ex) {
        toast.error(ex.response.data.error.message);
      }
    })();
  }, []);

    

  return (
    <div
      className="ViewEvent"
      class="container"
      style={{ marginTop: "50px" }}
    >
      <ToastContainer />
      <div class="row col-md-12 bg-light">
        <h2 style={{ textAlign: "center" }}>
          {event.Id === "0" ? "Crate new event" : "Edit event"}
        </h2>
      </div>

      <div class="row col-md-12 bg-light">
        <div class="col-md-3 bg-light "></div>
        <div
          class="col-md-6 bg-light "
          style={{ backgroundColor: "aliceblue" }}
        >


          <h3 style={{ textAlign: "left" }}>Title</h3>
          <h4 style={{ textAlign: "left", color: "gray" }}>{event.Title}</h4>
          <h3 style={{ textAlign: "left" }}>Description</h3>
          <h4 style={{ textAlign: "left", color: "gray" }}>{event.Description}</h4>
          <h3 style={{ textAlign: "left" }}>Date</h3>
          <h4 style={{ textAlign: "left", color: "gray" }}>{new Date(event.Date).toDateString()}</h4>
          <h3 style={{ textAlign: "left" }}>Owner</h3>
          <h4 style={{ textAlign: "left", color: "gray" }}>{event.Owner.Name}</h4>
          <h3 style={{ textAlign: "left" }}>Participants</h3>
            {
                persons && persons.map((e, i)=>{ return(<h4 style={{ textAlign: "left", color: "gray" }}>{e.Name}</h4>)})
            }
         
         <Link to={`/events/addoredit/${event.Id}`}>
          <button
            class="btn btn-primary"
            style={{ marginTop: "10px", width: "100px", margin: "10px" }}
            
          >
            Edit
          </button>
          </Link>
          <Link to={"/events"}>
            <button
              class="btn btn-danger"
              style={{ marginTop: "10px", width: "100px", margin: "10px" }}
            >
              Back to list
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ViewEvent;
