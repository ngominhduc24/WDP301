import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { useDispatch, useSelector } from "react-redux";
import axios from 'axios';

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
import { loginService } from "../../services/auth";
import { login } from "../../reduxToolkit/UserSlice";
import { URL_SERVER } from "../../dataConfig";

const Login = () => {
  const initialValues = {
    email: "",
    password: "",
  };
  const dispatch = useDispatch();

  const nav = useNavigate();
  const validationSchema = Yup.object({
    email: Yup.string()
      .required("email is required"),

    password: Yup.string()
      .matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/,
        "Password must contain at least one lowercase letter, one uppercase letter, and one digit"
      )
      .required("password is required"),
  });

  const handleSubmit = async (values) => {
    try {
      //  console.log(values);
      const res = await loginService(values);
      console.log("res login", res.data.data);

      dispatch(login(res.data.data));
      toast.success(res.data.message);
      if(res.data.data.accountType === "host"){
        nav("/");
      }
      else if(res.data.data.accountType === "renter"){
        nav("/rooms");
      }
    } catch (error) {
      toast.warning(error.response.data.error);
      console.log(error);
    }
  };

  // const loginWithGoogleHandle =  () => {
  //   window.open(` ${URL_SERVER}/auth/google/`, "_self");
  // };
  const loginWithGoogleHandle = () => {
    const scope = "email profile"; // Các phạm vi bạn muốn yêu cầu

    const authURL = `${URL_SERVER}/auth/google/?scope=${encodeURIComponent(
      scope
    )}`;

    window.open(authURL, "_self");
    
  };

  return (
    <>
      <div className="container">
        <div className=" row justify-content-center">
          <div className="col-10 col-md-6  content">
            <h1 className=" text-center">Login</h1>
            <Formik
              initialValues={initialValues}
              validationSchema={validationSchema}
              onSubmit={handleSubmit}
            >
              <Form>
                <div className="mb-3">
                  <Field
                    type="text"
                    label="Email or Username"
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
                    Login
                  </button>
                </div>
              </Form>
            </Formik>
            {/* <div className=" justify-content-center text-center mt-3 ">
              <button
                className=" w-100 my-2 col-md-11 btn btn-danger btn-lg btn-Login m-control-lg "
                type="submit"
                onClick={() => {
                  loginWithGoogleHandle();
                }}
              >
                Login with google
              </button>
            </div> */}
            <div className="my-3">
              <p className="font-semibold text-center text-gray-600 text-xl ">
                Do not have a account ?
                <h5 className="font-semibold text-gray-900 text-xl tracking-[-0.40px] w-auto">
                  <NavLink to={`/register`} style={{ color: "#e25e3e" }}>
                    {" "}
                    Register
                  </NavLink>
                </h5>
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
