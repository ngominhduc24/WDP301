import { Field, Form, Formik, ErrorMessage } from "formik";
import { useDispatch, useSelector } from "react-redux";
import { TextField, Select, MenuItem, Button, FormControl, InputLabel, FormHelperText, Box } from "@mui/material";
import { useMemo } from "react";
import * as Yup from "yup";
import { changePassword } from "../../../services/profile";
import Notification from "../../../CommonComponents/Notification";
import { logout } from "../../../services/auth";
import {  useNavigate } from "react-router-dom";
const ChangePassword = (props) => {
    const { children, value, index, ...other } = props;
    const userData = useSelector((state) => state.user.data);
    const initialValues = useMemo(() => {
        return {
            oldPassword: "",
            newPassword: "",
            confirmPassword: "",
        };
    }, []);

    const validationSchema = Yup.object().shape({
        oldPassword: Yup.string()
            .required('Vui lòng nhập mật khẩu cũ'),
        newPassword: Yup.string()
            .required('Vui lòng nhập mật khẩu mới')
            .min(8, 'Mật khẩu mới phải chứa ít nhất 8 ký tự')
            .matches(
                /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
                'Mật khẩu mới phải chứa ít nhất một chữ hoa, một chữ thường, một ký tự đặc biệt và một chữ số'
            ),
        confirmPassword: Yup.string()
            .oneOf([Yup.ref('newPassword'), null], 'Mật khẩu xác nhận phải trùng khớp với mật khẩu mới')
            .required('Vui lòng nhập lại mật khẩu mới')
    });
    const navigate = useNavigate();
    const handleChangePassword = async (values) => {
        await changePassword({ oldPassword: values.oldPassword, newPassword: values.newPassword }).then(data => {
            if (data.data.success === true) {
                Notification("Success", data.data.message, "").then((result) => {
                    logout();
                    navigate("/");
                    window.location.reload();

                })
            }
            else {
                Notification("Error", data.data.message, "");
            }
        }).catch(error => {
            Notification("Error", error, "");
        });


    }

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
            style={{ marginTop: "10px" }}
        >
            {value === index && (
                <Formik
                    initialValues={initialValues}
                    validationSchema={validationSchema}
                    onSubmit={handleChangePassword}
                >
                    <Form>
                        <Box sx={{
                            display: "flex",
                            flexDirection: "column",
                            gap: 3,
                        }}>
                            <FormControl fullWidth>
                                <Field
                                    label="Mật khẩu cũ"
                                    type="password"
                                    as={TextField}
                                    id="oldPassword"
                                    name="oldPassword"
                                />
                                <ErrorMessage name="oldPassword" component={FormHelperText} />
                            </FormControl>
                            <FormControl fullWidth>
                                <Field
                                    label="Mật khẩu mới"
                                    type="password"
                                    as={TextField}
                                    id="newPassword"
                                    name="newPassword"
                                />
                                <ErrorMessage name="newPassword" component={FormHelperText} />
                            </FormControl>
                            <FormControl fullWidth>
                                <Field
                                    label="Xác nhận mật khẩu mới"
                                    type="password"
                                    as={TextField}
                                    id="confirmPassword"
                                    name="confirmPassword"
                                />
                                <ErrorMessage name="confirmPassword" component={FormHelperText} />
                            </FormControl>
                        </Box>
                        <Button type="Submit" variant="contained" sx={{ mt: 3 }}>Xác nhận</Button>

                    </Form>
                </Formik>
            )}
        </div>
    );
}

export default ChangePassword;