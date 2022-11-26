import { toast } from 'react-toastify';

const toastConfig = {
  position: "top-right",
  autoClose: 5000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
  progress: undefined,
  theme: "dark",
}

const info = (message) => {
  toast.info(message, toastConfig)
}

const success = (message) => {
  toast.success(message, toastConfig)
}

const error = (message) => {
  toast.error(message, toastConfig)
}

const warning = (message) => {
  toast.warning(message, toastConfig)
}


export default { info, success, error, warning }