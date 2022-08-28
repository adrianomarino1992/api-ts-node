import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import axios from "axios";
import e from "cors";

const state = {
  Id: 0,
  Title: "",
  Description: "",
  Date: new Date(),
  Owner: {},
  Participants : []
};

const AddOrEditEvents = () => {
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

  const valueChanged = (evt) => {
    let { name, value } = evt.target;

    

    if(name === "Owner")
    {       
        value = persons.find(s => s.Id.toString().toString() === value.toString().trim());
        
        event.Owner = value;

    }if(name === "Participants")
    {
      let p = event.Participants.find(s => s.PersonId.toString().trim() === value.toString().trim());

     

      if(evt.target.checked)
      {
         if(!p){

          let ref = event.Participants.filter(s => s.PersonId.toString().trim() !== value.toString().trim());

          ref.push({
            PersonId : value.toString().trim(), 
            Person : persons.find(s => s.Id.toString().trim() === value.toString().trim()),             
            EventId : event.Id
          })

          setEvent({...event, ["Participants"] : ref});
        }else{
          
          setEvent({...event, ["Participants"] : event.Participants.filter(s => s.PersonId.toString().trim() !== value.toString().trim())});

        }
      }else{

        if(p)
        { 
          
          setEvent({...event, ["Participants"] : event.Participants.filter(s => s.PersonId.toString().trim() !== value.toString().trim())});
        }
      }
    }
    else{   
    
    setEvent({ ...event, [name]: value });
    }

    
    
    
  };

  const postData = async () => {
    try {
       await axios[event.Id > 0 ? "put" : "post"](
        event.Id > 0
          ? "http://localhost:1244/events/update"
          : "http://localhost:1244/events/add",
        {
          event: event,
        },
        {
          headers: {
            myKey: "key",
          }
        }
      );

      let toRemove = [];
      let toAdd = [];

      
      toRemove = parts.filter(s => event.Participants.filter(u => u.PersonId.toString().trim() === s.PersonId.toString().trim()).length === 0);
      toAdd = event.Participants.filter(s => parts.filter(u => u.PersonId.toString().trim() === s.PersonId.toString().trim()).length === 0);


      toRemove.forEach(async s => {

        await axios.post("http://localhost:1244/events/removePart", 
        {
          data : [
            event, persons.find(d => d.Id.toString().trim() === s.PersonId.toString().trim())
          ]}, 
          {
            headers: {
              myKey: "key",
            }
          })

      })

      toAdd.forEach(async s => {

        await axios.post("http://localhost:1244/events/addPart", 
        {
          data : [
            event, s.Person
          ]}, 
          {
            headers: {
              myKey: "key",
            }
          }        
        )

      })

      let msg = event.Id > 0 ? "Event updated" : "Event created";

      setTimeout(() => {
        navigate("/events");
      }, 1500);

      setTimeout(() => {
        toast.success(msg);
      }, 1700);
      

    } catch (ex) {
      
      
      if (ex.response && ex.response.data.error) {
        let msg = ex.response.data.error.message;

        if (
          ex.response.data.error.details &&
          ex.response.data.error.details.length > 0
        ) {
          msg = ex.response.data.error.details[0];
        }

        toast.error(msg);
      } else {
        console.log(ex.message);
        toast.error(ex.message);
      }
    }
  };

  return (
    <div
      className="AddOrEditEvents"
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
          <form>
            <div class="form-group">
              <h4 style={{ textAlign: "left", fontSize: "17px" }}>Title</h4>
              <input
                name="Title"
                type="text"
                class="form-control"
                placeholder="title..."
                value={event.Title}
                onChange={valueChanged}
              />
            </div>
            <div class="form-group">
              <h4 style={{ textAlign: "left", fontSize: "17px" }}>
                Description
              </h4>
              <input
                name="Description"
                type="text"
                class="form-control"
                placeholder="Description..."
                value={event.Description}
                onChange={valueChanged}
              />
            </div>
            <div class="form-group">
              <h4 style={{ textAlign: "left", fontSize: "17px" }}>Date</h4>
              <input
                name="Date"
                type="date"
                class="form-control"
                placeholder="Date..."                
                value={`${ new Date(event.Date).getFullYear()}-${new Date(event.Date).getMonth().toString().padStart('2','0')}-${new Date(event.Date).getDate().toString().padStart('2','0')}`}
                onChange={valueChanged}
              />
            </div>
            <div class="form-group">
              <h4 style={{ textAlign: "left", fontSize: "17px" }}>Owner</h4>
              <select
                name="Owner"
                
                class="form-control"
                placeholder="Owner..."                
                value={event.Owner.Id}
                onChange={valueChanged}
              >
                <option value='#' selected disabled>Select one person...</option>
                {persons &&
                  persons.map((e, i) => {
                    return <option value={e.Id}>{e.Name}</option>;
                  })}
              </select>
            </div>

            <div class="form-group">
            <div
              class="panel-heading text-left"
              style={{ backgroundColor: "black", width: "100%" }}>
              <h4 style={{color: 'white'}}>Participants</h4>
            </div>
            <div
                          class="panel-body text-left"
                          style={{ backgroundColor: "#F0F0F0" }}
                        >
                          {
                            persons.map((e, i)=>{ 

                              return(
                                <div class="form-check">
                                <label class="form-check-label">
                                  <input 
                                  type="checkbox" 
                                  class="form-check-input" 
                                  name="Participants" 
                                  value={e.Id} 
                                  onChange={valueChanged}
                                  checked={event.Participants.filter(s => s.PersonId.toString().trim() === e.Id.toString().trim()).length > 0}/>&nbsp;&nbsp;{e.Name}
                                </label>
                              </div>
                              )
                            
                            })
                          }
                        </div>
            </div>

            <br />
          </form>
          <button
            class="btn btn-primary"
            style={{ marginTop: "10px", width: "100px", margin: "10px" }}
            onClick={postData}
          >
            Save
          </button>
          <Link to={"/events"}>
            <button
              class="btn btn-danger"
              style={{ marginTop: "10px", width: "100px", margin: "10px" }}
            >
              Cancel
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AddOrEditEvents;
