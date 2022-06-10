
export default function isValidPhoneNumber(phoneNumber) {
    if (phoneNumber.length !== 10) {
        return false
    }

    for (let i = 0; i < phoneNumber.length; i++) {
        if (phoneNumber[i] < '0' || phoneNumber[i] > '9') {
            return false
        }
    }

    return /(03|05|07|08|09|01[2|6|8|9])+([0-9]{8})\b/.test(phoneNumber)

}