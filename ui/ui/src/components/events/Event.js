import { useEffect, useState } from "react";
import { confirmAlert } from 'react-confirm-alert'; 
import 'react-confirm-alert/src/react-confirm-alert.css'; 
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Link , useNavigate} from "react-router-dom";


const Event = () => {
    

    var [events, setEevents] = useState([]);

    useEffect(()=>{

        (async () => {
            try {
              var result = await axios.get("http://localhost:1244/events/getAll", {
                headers: {
                  myKey: "key",
                },
              });
      
              if (result.status === 200) {
                setEevents(result.data);
              } else {
                toast("Error in the request to the server");
              }
            } catch (ex) {
              toast.error(ex.response.data.error.message);
            }
          })();
        

    }, [])

    const deleteEvent = (dd) => {
      confirmAlert({
          title: `Delete: ${dd.Title}`,
          message: 'Are you sure to do this?',
          buttons: [
            {
              label: 'Delete',
              onClick: async () => 
              {
                  try{
                  await axios.delete('http://localhost:1244/events/delete', 
                  {
                      data: {
                          event : dd
                      }, 
                      headers : {myKey : 'key'}
                  })
  
                  toast.success("Event deleted");
  
                  document.getElementById(`row${dd.Id}`).style.display = "none";
                  
  
                  } catch (ex) {
        if (ex.response.data.error) {
          let msg = ex.response.data.error.message;
  
          if (
            ex.response.data.error.details &&
            ex.response.data.error.details.length > 0
          ) {
            msg = ex.response.data.error.details[0];
          }
  
          toast.error(msg);
        } else {
          toast.error(ex.message);
        }
      }
              }
            },
            {
              label: 'Cancel',
              onClick: () => {}
            }
          ]
        });
    };

    return(
        
        <div className="Event" class="container" style={{ marginTop: "50px" }}>
        <ToastContainer />
        <div class="row">
          <div class="col-md-6 bg-light text-left">
            <h2 style={{ textAlign: "left" }}>Events</h2>
          </div>
          <div class="col-md-6 bg-light text-right">
            <Link to={"/events/addoredit/0"}>
              <button
                class="btn btn-primary" id="create-btn"
                style={ {
                  fontWeight: "500",
                  marginTop: "20px",
                  marginRight: "30px",
                  width: "100px",
                }}
              >
                Create
              </button>
            </Link>
          </div>
        </div>
  
        <div class="row col-md-12" style={{ marginTop: "15px" }}>
          <div style={{ overflow: "auto", backgroundColor: "aliceblue" }}>
            <table className="table" id="table">
              <thead>
                <tr style={{ backgroundColor: "black" }}>
                  <th style={{ textAlign: "center", color: "white" }}></th>                  
                  <th style={{ textAlign: "center", color: "white" }}>Title</th>
                  <th style={{ textAlign: "center", color: "white" }}>Description</th>
                  <th style={{ textAlign: "center", color: "white" }}>Date</th>
                  <th style={{ textAlign: "center", color: "white" }}>Owner</th>
                  <th style={{ textAlign: "center", color: "white" }}>Participants</th>
                  <th style={{ textAlign: "center", color: "white" }}></th>
                </tr>
              </thead>
              <tbody>
                {events !== undefined &&
                  events.map((e, i) => {
                    return (
                      <tr key={i} id={`row${e.Id}`}>
                        <th style={{ textAlign: "center" }}>{e.Id}</th>                        
                        <td>{e.Title}</td>
                        <td>{e.Description}</td>
                        <td>{new Date(e.Date).toDateString()}</td>
                        <td>{e.Owner.Name}</td>
                        <td>{e.Participants.length}</td>
                        <td>
                          <Link to={`/persons/view/${e.Id}`}>
                            <button
                              class="btn btn-success"
                              style={{ width: "70px" , marginLeft: "10px", marginTop: "5px"}}
                            >
                              Details
                            </button>
                          </Link>
                          <Link to={`/events/addoredit/${e.Id}`}>
                            <button
                              class="btn btn-primary"
                              style={{ width: "70px", marginLeft: "10px" ,  marginTop: "5px"}}
                            >
                              Edit
                            </button>
                          </Link>
  
                          <button
                            class="btn btn-warning"
                            style={{ width: "70px", marginLeft: "10px",  marginTop: "5px" }}
                            onClick={()=> {deleteEvent(e)}}
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    
    )

}

export default Event;