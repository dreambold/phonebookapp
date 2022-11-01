import React, { useState, useEffect } from "react";
import "./homepage.css";
import { Button, Modal } from "react-bootstrap";
import Dialog from "@material-ui/core/Dialog";
import List from "@material-ui/core/List";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";
import axios from "axios";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Home() {
  const Api_routes = "https://client-list-data-backend.herokuapp.com/api/";
  const [contactmodel, addcontactmodel] = useState(false);
  const [show, setShow] = useState(false);
  const [inputValue, setInputValue] = useState({});
  const [errors, setErrors] = useState({});
  const [contactData, setContactData] = useState([]);
  const [idForDelete, setIdForDelete] = useState("");
  const [search, setSearch] = useState("");
  const [isEdit, setIsEdit] = useState(false);
  const [idforEdit, setIdforEdit] = useState("");

  const handleOnChange = (e) => {
    const { name, value } = e.target;
    setInputValue({ ...inputValue, [name]: value });
    setErrors({ ...errors, [name]: "" });
  };

  useEffect(() => {
    getAllContact();
  }, []);

  const getAllContact = () => {
    axios
      .get(`${Api_routes}contact/find`)
      .then((res) => {
        setContactData(res?.data);
      })
      .catch((error) => {
        toast.error("somthing was worng please try again!!");
      });
  };

  const handleContactmodal = () => {
    setInputValue({});
    setIdforEdit("");
    setErrors({});
    setIsEdit(false);
    addcontactmodel(!contactmodel);
  };

  const handleClose = () => {
    setShow(false);
  };

  const validationData = () => {
    let formIsValid = true;
    let errors = {};
    if (inputValue && !inputValue.Firstname) {
      formIsValid = false;
      errors["Firstname"] = "*please enter first name";
    }
    if (inputValue && !inputValue.lastname) {
      formIsValid = false;
      errors["lastname"] = "*please enter last name";
    }
    if (inputValue && !inputValue.phone) {
      formIsValid = false;
      errors["phone"] = "*please enter phone number";
    }
    setErrors(errors);
    return formIsValid;
  };

  const AddContact = async (e) => {
    if (validationData()) {
      e.preventDefault();
      const payload = {
        firstname: inputValue?.Firstname,
        lastname: inputValue?.lastname,
        phone: inputValue?.phone,
      };
      axios
        .post(`${Api_routes}contact/create`, payload)
        .then((res) => {
          getAllContact();
          toast.success("Contact added successfully");
          addcontactmodel(false);
          setInputValue({});
        })
        .catch((error) => {
          toast.error("Something went wrong please try again!!!");
        });
    }
  };

  const editContact = async (e) => {
    if (validationData()) {
      e.preventDefault();
      const payload = {
        firstname: inputValue?.Firstname,
        lastname: inputValue?.lastname,
        phone: inputValue?.phone,
      };
      axios
        .put(`${Api_routes}contact/update?id=${idforEdit}`, payload)
        .then((res) => {
          getAllContact();
          toast.success("Contact updated successfully");
          addcontactmodel(false);
          setInputValue({});
          setIdforEdit("");
          setIsEdit(false);
        })
        .catch((error) => {
          toast.error("Something went wrong please try again!!!");
        });
    }
  };
  const handleDeleteAnnouncement = () => {
    // Todo DELETE API
    axios
      .delete(`${Api_routes}contact/remove?id=${idForDelete}`)
      .then((res) => {
        getAllContact();
        toast.success("Contact deleted successfully...");
        setShow(false);
      })
      .catch((error) => {
        toast.error("Something went wrong please try again!!!");
      });
  };

  const OnSearchChange = (e) => {
    setSearch(e.target.value?.toLowerCase());
  };

  return (
    <>
      <ToastContainer />
      <div className="container">
        <div className="d-flex justify-content-center pt-3 pb-5">
          <h3>
            <i className="fa fa-address-book"></i>
            <span className="m-3">Phone Book App </span>
          </h3>
        </div>

        <div className="d-flex justify-content-between">
          <h4>Contacts</h4>
          <button
            onClick={(e) => handleContactmodal()}
            type="button"
            className="btn btn-primary"
          >
            + Add Contact
          </button>
        </div>

        <div className="mt-4">
          <form>
            <div className="form-group " id="input-container">
              <i className="fa-solid fa-magnifying-glass"></i>
              <input
                type="text"
                className="form-control"
                onChange={(e) => OnSearchChange(e)}
                placeholder="Search for contact by name..."
              />
            </div>
          </form>
        </div>

        <div className="mt-4">
          <ul className="list-group">
            {contactData?.map((item) => {
              if(search !="" && (item?.firstname?.toLowerCase().indexOf(search) == -1  && item.lastname?.toLowerCase().indexOf(search) == -1 )){
                return null;
              }

              return (
                <li className="list-group-item d-flex justify-content-between align-items-center" key={item._id}>
                  <div>
                    <h5>
                      {item?.firstname} {item?.lastname}
                    </h5>
                    <span className="light-gray">
                      <i className="fa-solid fa-phone phone-style"></i>
                      {item?.phone}
                    </span>
                  </div>

                  <div>
                    <button
                      onClick={(e) => {
                        setIsEdit(true);
                        addcontactmodel(true);
                        setIdforEdit(item?._id);
                        setInputValue({
                          Firstname: item?.firstname,
                          lastname: item?.lastname,
                          phone: item?.phone,
                        });
                      }}
                      type="button"
                      className="btn btn-success"
                    >
                      <i className="fa-regular fa-pen-to-square"></i>
                    </button>

                    <button
                      onClick={(e) => {
                        setShow(true);
                        setIdForDelete(item?._id);
                      }}
                      type="button"
                      className="btn btn-danger"
                    >
                      {" "}
                      <i className="fa fa-trash" aria-hidden="true"></i>
                    </button>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      </div>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title className="text-danger">Alert!</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure you want to delete this conatct?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            No
          </Button>
          <Button
            variant="danger"
            onClick={() => {
              handleDeleteAnnouncement();
            }}
          >
            Yes
          </Button>
        </Modal.Footer>
      </Modal>

      {contactmodel ? (
        <>
          <Dialog
            fullScreen
            open={contactmodel}
            onClose={handleContactmodal}
            //   TransitionComponent={Transition}
          >
            <div className="p-2 d-flex justify-content-start">
              <IconButton
                edge="start"
                color="inherit"
                onClick={handleContactmodal}
                aria-label="close"
              >
                <CloseIcon />
              </IconButton>
            </div>

            <div className="gap">
              <List>
                <div className="form-group row mt-4">
                  <label className="col-xl-3 col-lg-3 col-form-label">
                    First name
                  </label>
                  <div className="col-lg-9 col-xl-6">
                    <div>
                      <input
                        type="text"
                        className={`form-control form-control-lg form-control-solid `}
                        id="First-name"
                        name="Firstname"
                        value={inputValue?.Firstname}
                        onChange={(e) => {
                          handleOnChange(e);
                        }}
                      />
                    </div>
                    <span
                      style={{
                        color: "red",
                        top: "5px",
                        fontSize: "12px",
                      }}
                    >
                      {errors["Firstname"]}
                    </span>
                  </div>
                </div>

                <div className="form-group row mt-4">
                  <label className="col-xl-3 col-lg-3 col-form-label">
                    last name
                  </label>
                  <div className="col-lg-9 col-xl-6">
                    <div>
                      <input
                        type="text"
                        className={`form-control form-control-lg form-control-solid `}
                        id="last-name"
                        name="lastname"
                        value={inputValue?.lastname}
                        onChange={(e) => {
                          handleOnChange(e);
                        }}
                      />
                    </div>
                    <span
                      style={{
                        color: "red",
                        top: "5px",
                        fontSize: "12px",
                      }}
                    >
                      {errors["lastname"]}
                    </span>
                  </div>
                </div>

                <div className="form-group row mt-4">
                  <label className="col-xl-3 col-lg-3 col-form-label">
                    Phone number
                  </label>
                  <div className="col-lg-9 col-xl-6">
                    <div>
                      <input
                        type="number"
                        className={`form-control form-control-lg form-control-solid `}
                        id="phone"
                        name="phone"
                        value={inputValue?.phone}
                        onChange={(e) => {
                          handleOnChange(e);
                        }}
                      />
                    </div>
                    <span
                      style={{
                        color: "red",
                        top: "5px",
                        fontSize: "12px",
                      }}
                    >
                      {errors["phone"]}
                    </span>
                  </div>
                </div>

                <div className="d-flex align-items-center justify-content-center">
                  <button
                    onClick={(e) => (isEdit ? editContact(e) : AddContact(e))}
                    className="btn  btn-success mt-5"
                  >
                    <span>{isEdit ? "Update" : "Add"} Contact</span>
                  </button>
                </div>
              </List>
            </div>
          </Dialog>
        </>
      ) : null}
    </>
  );
}
