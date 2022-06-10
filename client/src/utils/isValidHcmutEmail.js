
export default function isValidPassword(password) {

    return /^[A-Za-z0-9._%+-]+@hcmut.edu.vn$/.test(password)

}