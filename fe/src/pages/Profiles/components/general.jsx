import { Formik, Form, Field, ErrorMessage } from "formik";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateUser } from "../../../services/auth";
import * as Yup from "yup";
import Cookies from "js-cookie";
import Notification from "../../../CommonComponents/Notification";
import { login } from "../../../reduxToolkit/UserSlice";
import Button from "@mui/material/Button";


const General = (props) => {
    const { children, value, index, ...other } = props;
    const userData = useSelector((state) => state?.user?.data);
    const [isEditMode, setIsEditMode] = useState(false);
    const initialValues = {
        name: userData?.name || "",
        phone: userData?.phone || "",
        payosClientId: userData?.payosClientId || "",
        payosAPIKey: userData?.payosAPIKey || "",
        payosCheckSum: userData?.payosCheckSum || "",
        // email: userData.email || "",
        // avatar: null,
    };
    console.log("userData",userData);
    const validationSchema = Yup.object().shape({
        name: Yup.string().required(" name can not be blank").required("Required"),
        phone: Yup.string()
            .matches(/^[0-9]{10}$/, "The phone number must have exactly 10 digits")
            .nullable(),
        // Các quy tắc cho các trường dữ liệu khác
    });
    const accessToken = Cookies.get("accessToken");
    const dispatch = useDispatch();
    const handleSubmitForm = async (values) => {
        try {
            const res = await updateUser(accessToken, values);
            const data = res?.data?.data;
            console.log("data", data);
            // setUser(data);
            dispatch(login(data))   
            setIsEditMode(false);
            Notification("Success", res.data.message, "")
        } catch (error) {
            console.log(error);
        }
    };
    useEffect(()=>{

    },[userData])
    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
        >
            {value === index && (
                <div className=" component-profile ">

                    <div className="">
                        <Formik
                            initialValues={initialValues}
                            validationSchema={validationSchema}
                            onSubmit={handleSubmitForm}
                        >
                            {({ values, setFieldValue }) => (
                                <Form>
                                    <div>
                                        {/* Trường tải ảnh lên */}
                                        {/* <div>
                        <div className="form-group row mb-3">
                          <label className="col-md-2" htmlFor="avatar">
                            Avatar:
                          </label>
                          <div className="col-md-7">
                            <input
                              type="file"
                              id="avatar"
                              name="avatar"
                              onChange={(event) => {
                                setFieldValue(
                                  "avatar",
                                  // 
                                  base64Data
                                );
                              }}
                              disabled={!isEditMode}
                            />
                            <ErrorMessage name="avatar" component="div" />
                          </div>

                          {values.avatar && (
                        <div className="form-group row mb-3">
                          <label className="col-md-2" htmlFor="avatar">
                            Avatar Preview:
                          </label>
                          <div className="col-md-7">
                            <img
                              src={URL.createObjectURL(values.avatar)}
                              alt="Avatar Preview"
                              style={{ maxWidth: "100%" }}
                            />
                          </div>
                        </div>
                      )}
                        </div>
                      </div> */}
                                    </div>
                                    <div className=" form-group row mb-3 mt-3">
                                        <label className="col-md-2" htmlFor="name">
                                            Tên:
                                        </label>
                                        <div className="col-md-7">
                                            <Field
                                                type="text"
                                                id="name"
                                                name="name"
                                                className="form-control"

                                                disabled={!isEditMode}
                                            />
                                            <ErrorMessage name="name" component="div" />
                                        </div>
                                    </div>

                                    <div className=" form-group row mb-3">
                                        <label className="col-md-2" htmlFor="phone">
                                            Số điện thoại:
                                        </label>
                                        <div className="col-md-7">
                                            <Field
                                                type="text"
                                                id="phone"
                                                name="phone"
                                                className="form-control"
                                                disabled={!isEditMode}
                                            />
                                            <ErrorMessage name="phone" component="div" />
                                        </div>
                                    </div>
                                    <div className=" form-group row mb-3">
                                        <label className="col-md-2" htmlFor="email">
                                            Email:
                                        </label>
                                        <div className="col-md-7">
                                            <Field
                                                type="email"
                                                id="email"
                                                name="email"
                                                className="form-control"
                                                value={userData?.email}
                                                disabled={true}
                                            />
                                            <ErrorMessage name="email" component="div" />
                                        </div>
                                    </div>
                                    <div className=" form-group row mb-3">
                                        <label className="col-md-2" htmlFor="payosClientId">
                                            payosClientId:
                                        </label>
                                        <div className="col-md-7">
                                            <Field
                                                type="text"
                                                id="payosClientId"
                                                name="payosClientId"
                                                className="form-control"
                                                disabled={!isEditMode}
                                            />
                                            <ErrorMessage name="payosClientId" component="div" />
                                        </div>
                                    </div>
                                    <div className=" form-group row mb-3">
                                        <label className="col-md-2" htmlFor="payosAPIKey">
                                            payosAPIKey:
                                        </label>
                                        <div className="col-md-7">
                                            <Field
                                                type="text"
                                                id="payosAPIKey"
                                                name="payosAPIKey"
                                                className="form-control"
                                                disabled={!isEditMode}
                                            />
                                            <ErrorMessage name="payosClientId" component="div" />
                                        </div>
                                    </div>
                                    <div className=" form-group row mb-3">
                                        <label className="col-md-2" htmlFor="payosCheckSum">
                                            payosCheckSum:
                                        </label>
                                        <div className="col-md-7">
                                            <Field
                                                type="text"
                                                id="payosCheckSum"
                                                name="payosCheckSum"
                                                className="form-control"
                                                disabled={!isEditMode}
                                            />
                                            <ErrorMessage name="payosClientId" component="div" />
                                        </div>
                                    </div>

                                    {/* <button type="submit">Lưu</button> */}
                                    <div className="profile-action">
                                        {isEditMode ? (
                                            <>
                                                <div className="row">
                                                    <div className="col-6 text-right">
                                                        <Button
                                                            variant="outlined"
                                                            type="submit"
                                                            className="btn btn-bg-primary  btn-radius"
                                                        >
                                                            Save
                                                        </Button>
                                                    </div>
                                                    <div className="col-6 text-right">
                                                        <Button
                                                            variant="outlined"
                                                            type="button"
                                                            className="btn btn-bg-primary  btn-radius"
                                                            onClick={() => setIsEditMode(false)}
                                                        >
                                                            Cancel
                                                        </Button>
                                                    </div>
                                                </div>
                                            </>
                                        ) : (
                                            <>
                                                <Button
                                                    variant="contained"
                                                    className="btn btn-bg-primary  "
                                                    onClick={() => setIsEditMode(true)}
                                                >
                                                    Edit
                                                </Button>
                                            </>
                                        )}
                                    </div>
                                </Form>
                            )}
                        </Formik>
                    </div>
                </div>
            )}
        </div>
    );
}

export default General;