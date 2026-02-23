import Swal from "sweetalert2";

const defaultConfirmButtonColor = "#1976d2";
const defaultCancelButtonColor = "#757575";

export const sweetAlert = {
  /** Success toast / modal (e.g. after saving profile). */
  success(title: string, text?: string) {
    return Swal.fire({
      title,
      text: text ?? "",
      icon: "success",
      confirmButtonColor: defaultConfirmButtonColor,
      timer: 2500,
      timerProgressBar: true,
    });
  },

  /** Error alert. */
  error(title: string, text?: string) {
    return Swal.fire({
      title,
      text: text ?? "",
      icon: "error",
      confirmButtonColor: defaultConfirmButtonColor,
    });
  },

  /** Warning alert. */
  warning(title: string, text?: string) {
    return Swal.fire({
      title,
      text: text ?? "",
      icon: "warning",
      confirmButtonColor: defaultConfirmButtonColor,
    });
  },

  /** Info alert. */
  info(title: string, text?: string) {
    return Swal.fire({
      title,
      text: text ?? "",
      icon: "info",
      confirmButtonColor: defaultConfirmButtonColor,
    });
  },

  /** Confirm dialog; resolves to true if confirmed, false if cancelled. */
  confirm(title: string, text?: string, confirmText = "Yes", cancelText = "Cancel") {
    return Swal.fire({
      title,
      text: text ?? "",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: defaultConfirmButtonColor,
      cancelButtonColor: defaultCancelButtonColor,
      confirmButtonText: confirmText,
      cancelButtonText: cancelText,
    }).then((result) => Promise.resolve(!!result.isConfirmed));
  },
};

export default sweetAlert;
