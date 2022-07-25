
export default function isValidStudentCode(code) {
    if (code.length !== 7) {
        return false
    }

    for (let index = 0; index < code.length; index++) {
        if (code.charAt(index) < '0' || code.charAt(index) > '9') {
            return false
        }
    }

    const curYear = (new Date().getFullYear())
    const preFixCode = code.substring(0, 2)
    const year = 2000 + parseInt(preFixCode)

    if (year > curYear) {
        return false
    }

    return true
}