import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { useDispatch, useSelector } from "react-redux";

import * as Yup from "yup";
import {
  useNavigate,
  Outlet,
  NavLink,
  useParams,
  redirect,
} from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import TextField from "@mui/material/TextField";
import "./Login.scss";
import { loginService, registerService } from "../../services/auth";
import { login } from "../../reduxToolkit/UserSlice";

const Login = () => {
  const initialValues = {
    username: "",
    name: "",
    email: "",
    password: "",
  };
  //   const dispatch = useDispatch();


  const nav = useNavigate();
  const validationSchema = Yup.object({
    email: Yup.string()
      .email("Invalid email address")
      .matches(
        /^[A-Za-z0-9._%+-]+@(?:[A-Za-z0-9-]+\.)+[A-Za-z]{2,}$/,
        "Invalid email address"
      )
      .required("email is required"),

    password: Yup.string()
      .matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/,
        "Password must contain at least one lowercase letter, one uppercase letter, and one digit"
      )
      .required("password is required"),
    name: Yup.string().required("name is required"),
    username: Yup.string().required("username is required"),
  });

  const handleSubmit = async (values) => {
    try {
      console.log(values);
      const res = await registerService(values);
      console.log("res register", res.data.data);

      //    dispatch(login(res.data.data))
      toast.success(res.data.message);

      nav("/login");
    } catch (error) {
      toast.warning(error.response.data.error);
      console.log(error);
    }
  };

  return (
    <>


      <div className="container">
        <div className=" row justify-content-center">
          <div className="col-10 col-md-6  content">
            <h1 className=" text-center">Register</h1>
            <Formik
              initialValues={initialValues}
              validationSchema={validationSchema}
              onSubmit={handleSubmit}
            >
              <Form>
                <div className="mb-3">
                
                  <Field
                    // type="email"
                    label="Username"
                    className="form-control"
                     id="username"
                    variant="outlined"
                    name="username"
                    as={TextField}
                  />

                  <ErrorMessage
                    name="username"
                    component="div"
                    className="text-danger"
                  />
                </div>
              <div className="mb-3">
                  <Field
                    // type="email"
                    label="Name"
                    className="form-control"
                    id="name"
                    variant="outlined"
                    name="name"
                    as={TextField}
                  />

                  <ErrorMessage
                    name="name"
                    component="div"
                    className="text-danger"
                  />
                </div>
                <div className="mb-3">
                  <Field
                    type="email"
                    label="Email"
                    className="form-control"
                    id="email"
                    variant="outlined"
                    name="email"
                    as={TextField}
                  />

                  <ErrorMessage
                    name="email"
                    component="div"
                    className="text-danger"
                  />
                </div>
                <div className="mb-3">
                  <Field
                    type="password"
                    label="Password"
                    className="form-control"
                    id="password"
                    variant="outlined"
                    name="password"
                    as={TextField}
                  />
                  <ErrorMessage
                    name="password"
                    component="div"
                    className="text-danger"
                  />
                </div>

                <div className=" justify-content-center text-center mt-3 ">
                  <button
                    className=" w-100 my-2 col-md-11 btn btn-dark btn-lg btn-Login m-control-lg "
                    type="submit"
                  >
                    Register
                  </button>
                </div>
                {/* <div className=" justify-content-center text-center mt-3 ">
                  <button
                    className=" w-100 my-2 col-md-11 btn btn-danger btn-lg btn-Login m-control-lg "
                    type="submit"
                  >
                    Login with google
                  </button>
                </div> */}

                <div className="my-3">
                  <p className="font-semibold text-center text-gray-600 text-xl ">
                    Do you have a account ?
                    <h5 className="font-semibold text-gray-900 text-xl tracking-[-0.40px] w-auto">
                      <NavLink to={`/login`} style={{ color: "#e25e3e" }}>
                        {" "}
                        Login
                      </NavLink>
                    </h5>
                  </p>
                </div>
              </Form>
            </Formik>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
