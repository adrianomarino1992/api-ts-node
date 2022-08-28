import { useEffect, useState } from "react";
import { Link, useNavigate, useParams  } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import axios from "axios";

const state = {
  Id: 0,
  Name: "",
  Email: "",
  Phone: "",
};

const AddOrEdit = () => {
  const { id } = useParams();

  var navigate = useNavigate();

  state.Id = id;

  var [user, setUser] = useState(state);

  useEffect(()=>{

    (async()=>{


        try{
            if(user.Id > 0){
            var result  = await axios.get('http://localhost:1244/persons/getbyid', 
            {        
                params: {
                    id :  user.Id
                },
                headers: {
                    myKey : "key"
                }
                
            });
            
            if(result.status === 200)
            {                
                setUser(result.data[0]);  
    
            }else{

                toast("Error in the request to the server")
            }
        }
        }catch(ex){
            
            toast.error(ex.response.data.error.message);
        }
        })();

  }, [])

  const valueChanged = (evt) => {
    let { name, value } = evt.target;
    setUser({ ...user, [name]: value });
  };

  const postData = async () => {
    try {
      var resp = await axios[(user.Id > 0 ? "put" : "post")](
        user.Id > 0
          ? "http://localhost:1244/persons/update"
          : "http://localhost:1244/persons/add",
        {
          person: user,
        },
        {
          headers: {
            myKey: "key",
          },
        }
      );

      let msg = user.Id > 0 ? "User updated" : "User created";

      setTimeout(()=>{toast.success(msg);}, 500);
      navigate('/persons');

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
  };

  return (
    <div className="AddOrEdit" class="container" style={{ marginTop: "50px" }}>
      <ToastContainer />
      <div class="row col-md-12 bg-light">
        <h2 style={{ textAlign: "center" }}>
          {user.Id === "0" ? "Crate new person" : "Edit person"}
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
              <h4 style={{ textAlign: "left", fontSize: "17px" }}>Name</h4>
              <input
                name="Name"
                type="text"
                class="form-control"
                placeholder="Name..."
                value={user.Name}
                onChange={valueChanged}
              />
            </div>
            <div class="form-group">
              <h4 style={{ textAlign: "left", fontSize: "17px" }}>Email</h4>
              <input
                name="Email"
                type="email"
                class="form-control"
                placeholder="Email..."
                value={user.Email}  
                disabled={user.Id > 0}                             
                onChange={valueChanged}
              />
            </div>
            <div class="form-group">
              <h4 style={{ textAlign: "left", fontSize: "17px" }}>Phone</h4>
              <input
                name="Phone"
                type="text"
                class="form-control"
                placeholder="Phone..."
                value={user.Phone}
                onChange={valueChanged}
              />
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
          <Link to={"/persons"} >
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

export default AddOrEdit;
