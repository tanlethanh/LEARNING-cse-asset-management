export default function reverseName(fullName) {
    const arrName = fullName.split(' ')
    let newName = arrName[arrName.length - 1]
    arrName.forEach((element, index) => {
        if (index < arrName.length - 1) newName += " " + element
    });
    return newName
}