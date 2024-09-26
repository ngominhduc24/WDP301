import Swal from "sweetalert2";
const Notification = (typeNotification, title, message) => {
  if (typeNotification === "Confirm") {
    return new Promise((resolve) => {
      Swal.fire({
        title: title,
        text: message,
        icon: "question",
        showCancelButton: true,
        confirmButtonText: "OK",
        cancelButtonText: "Cancel",
      }).then((result) => {
        if (result.isConfirmed) {
          resolve(true); // Trả về true nếu người dùng chọn OK
        } else if (result.isDismissed) {
          resolve(false); // Trả về false nếu người dùng chọn Cancel
        }
      });
    });
  } else if (typeNotification === "Success") {
    return new Promise((resolve) => {
      Swal.fire({
        title: title,
        text: message,
        icon: "success",
      }).then(() => {
        resolve(true);
      });
    });
  } 
  else if (typeNotification === "Error") {
    return new Promise((resolve) => {
      Swal.fire({
        title: title,
        text: message,
        icon: "warning",
      });
    });
  }
  else {
    return new Promise((resolve) => {
      Swal.fire({
        title: title,
        text: message,
        icon: "error",
      });
    });
  }
};

export default Notification;
