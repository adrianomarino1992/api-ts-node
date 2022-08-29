import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import axios from "axios";


const state = {
  Id: 0,
  Name: "",
  Email: "",
  Phone: "",
};

var events = [];
var eventsParts = [];

const View = () => {
  const { id } = useParams();

  var navigate = useNavigate();

  state.Id = id;

  var [user, setUser] = useState(state);
  var [eventsO, setEventsOwner] = useState(events);
  var [eventsP, setEventsParts] = useState(eventsParts);

  useEffect(() => {
    (async () => {
      try {
        if (user.Id > 0) {
          var result = await axios.get(
            "http://localhost:1244/persons/getbyid",
            {
              params: {
                id: user.Id,
              },
              headers: {
                myKey: "key",
              },
            }
          );

          if (result.status === 200) {
            setUser(result.data[0]);

            result = await axios.get(
              "http://localhost:1244/events/getByOwner",
              {
                params: {
                  ownerId: user.Id,
                },
                headers: {
                  myKey: "key",
                },
              }
            );

            setEventsOwner(result.data);

            result = await axios.get(
              "http://localhost:1244/events/getByParticipant",
              {
                params: {
                  partId: user.Id,
                },
                headers: {
                  myKey: "key",
                },
              }
            );

            setEventsParts(result.data);
          } else {
            toast("Error in the request to the server");
          }
        }
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
    })();
  }, []);

  return (
    <div className="View" class="container" style={{ marginTop: "50px" }}>
      <h2>{user.Name}</h2>
      <div class="row col-md-12">
        <div class="col-md-3"></div>
        <div class="col-md-6" style={{ backgroundColor: "aliceblue" }}>
          <h3 style={{ textAlign: "left" }}>Email</h3>
          <h4 style={{ textAlign: "left", color: "gray" }}>{user.Email}</h4>
          <h3 style={{ textAlign: "left" }}>Phone</h3>
          <h4 style={{ textAlign: "left", color: "gray" }}>{user.Phone}</h4>
          <h3 style={{ textAlign: "left" }}>Indetifier</h3>
          <h4 style={{ textAlign: "left", color: "gray" }}>{user.Id}</h4>

          <div
            class="col-md-12 panel panel-primary"
            style={{
              border: "none",
              backgroundColor: "#f0f0f0",
              padding: '0px',
              display:
                eventsO.length > 0 || eventsP.length > 0 ? "block" : "none",
            }}
          >
            <div
              class="panel-heading text-left"
              style={{ backgroundColor: "black", width: "100%" }}
            >
              <h4 style={{color: 'white'}}>Events</h4>
            </div>
            <div class="panel-body text-left">
              <div
                class={eventsP.length > 0 ? "col-md-6" : "col-md-12"}
                style={{ display: eventsO.length > 0 ? "block" : "none" }}
              >
                {(() => {
                  if (eventsO && eventsO.length > 0)
                    return (
                      <h3 style={{ textAlign: "left" }}>
                        <h4 style={{ textAlign: "left", color: "gray" }}>
                          As Owner
                        </h4>
                      </h3>
                    );
                })()}

                {eventsO &&
                  eventsO.length > 0 &&
                  eventsO.map((e) => {
                    return (
                      <div
                        class="panel panel-primary"
                        style={{ border: "none" }}
                      >
                        <Link to={`/events/view/${e.Id}`}>
                        <div
                          class="panel-heading text-left"
                          style={{ backgroundColor: "black", cursor: "pointer" }}
                        >
                          
                          <h4 style={{color: 'white'}}>{e.Title}</h4>
                        </div>
                        </Link>
                        <div
                          class="panel-body text-left"
                          style={{ backgroundColor: "aliceblue" }}
                        >
                          {e.Description}
                          <br />
                          Participants : {e.Participants.length}
                        </div>
                      </div>
                    );
                  })}
              </div>

              <div
                class={eventsO.length > 0 ? "col-md-6" : ""}
                style={{ display: eventsP.length > 0 ? "block" : "none" }}
              >
                {(() => {
                  if (eventsP && eventsP.length > 0)
                    return (
                      <h3 style={{ textAlign: "left" }}>
                        <h4 style={{ textAlign: "left", color: "gray" }}>
                          As Participant
                        </h4>
                      </h3>
                    );
                })()}

                {eventsP &&
                  eventsP.length > 0 &&
                  eventsP.map((e) => {
                    return (
                      <div
                        class="panel panel-primary"
                        style={{ border: "none" }}
                      >
                        <Link to={`/events/view/${e.Id}`}>
                        <div
                          class="panel-heading text-left"
                          style={{ backgroundColor: "black" }}
                        >
                           <h4 style={{color: 'white'}}>{e.Title}</h4>
                        </div>
                        </Link>
                        <div
                          class="panel-body text-left"
                          style={{ backgroundColor: "aliceblue" }}
                        >
                          {e.Description}
                          <br />
                          Participants : {e.Participants.length}
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>
          </div>

          <Link to={`/persons/addoredit/${user.Id}`}>
            <button
              class="btn btn-primary"
              style={{ width: "100px", marginLeft: "10px" }}
            >
              Edit
            </button>
          </Link>
          <Link to={`/persons`}>
            <button
              class="btn btn-danger"
              style={{ width: "100px", marginLeft: "10px" }}
            >
              Back to list
            </button>
          </Link>

          <br />
          <br />
        </div>
      </div>
    </div>
  );
};

export default View;
