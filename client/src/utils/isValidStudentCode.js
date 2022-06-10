
export default function isValidStudentCode(code) {
    if (code.length !== 7) {
        return false
    }
    const curYear = (new Date().getFullYear())
    const preFixCode = code.substring(0, 2)
    const year = 2000 + parseInt(preFixCode)
    console.log(year)
    if (year > curYear) {
        return false
    }

    return true
}