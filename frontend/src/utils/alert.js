import Swal from "sweetalert2";

export const showSuccess = (message) => {
  Swal.fire({
    toast: true,
    position: "top-end",
    icon: "success",
    title: message,
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
  });
};

export const showError = (message) => {
  Swal.fire({
    toast: true,
    position: "top-end",
    icon: "error",
    title: message,
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
  });
};

export const showWarning = (message) => {
  Swal.fire({
    toast: true,
    position: "top-end",
    icon: "warning",
    title: message,
    showConfirmButton: false,
    timer: 3000,
  });
};