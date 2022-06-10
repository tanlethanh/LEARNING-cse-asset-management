
export default function convertValidName(name) {
    const names = name.toLowerCase().split(' ')
    names.forEach((element, index) => {
        names[index] = element.charAt(0).toUpperCase() + element.slice(1)
    });

    const validName = names.join(' ')

    return validName

}