import { Notify } from 'quasar'

export function notifySuccess(message, options = {}) {
  Notify.create({
    message,
    color: 'green-4',
    textColor: 'white',
    icon: 'sym_o_check_circle',
    position: 'top',
    timeout: 3000,
    ...options,
  })
}

export function notifyError(message, options = {}) {
  Notify.create({
    message,
    color: 'red-5',
    textColor: 'white',
    icon: 'sym_o_error',
    position: 'top',
    timeout: 5000,
    ...options,
  })
}

export function notifyWarning(message, options = {}) {
  Notify.create({
    message,
    color: 'amber',
    textColor: 'black',
    icon: 'sym_o_warning',
    position: 'top',
    timeout: 4000,
    ...options,
  })
}

export function notifyInfo(message, options = {}) {
  Notify.create({
    message,
    color: 'blue-5',
    textColor: 'white',
    icon: 'sym_o_info',
    position: 'top',
    timeout: 3000,
    ...options,
  })
}
