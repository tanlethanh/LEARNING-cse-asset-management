import reverseName from "../utils/reverseName"
export function arrangeList(list, field, type, order) {

    if (!field || !type || !order) return list

    const result = new Array(...list)

    if (type === "name") {
        result.sort((a, b) => {
            const valueA = reverseName(a[field].toLowerCase())
            const valueB = reverseName(b[field].toLowerCase())
            if (order === "inc") {
                return valueA > valueB ? -1 : (valueA < valueB ? 1 : 0)
            }
            else if (order === "dec") {
                return valueA > valueB ? 1 : (valueA < valueB ? -1 : 0)
            }
        })
    }
    else if (type === "string") {
        result.sort((a, b) => {
            const valueA = a[field]
            const valueB = b[field]
            if (order === "inc") {
                return valueA > valueB ? -1 : (valueA < valueB ? 1 : 0)
            }
            else if (order === "dec") {
                return valueA > valueB ? 1 : (valueA < valueB ? -1 : 0)
            }
        })
    }
    else if (type === "date") {
        result.sort((a, b) => {
            let valueA = new Date(a[field]).getTime()
            let valueB = new Date(b[field]).getTime()
            if (String(valueA) === "NaN") {
                valueA = 0
            }
            if (String(valueB) === "NaN") {
                valueB = 0
            }

            if (order === "inc") {
                return valueA > valueB ? 1 : (valueA < valueB ? -1 : 0)
            }
            else if (order === "dec") {
                return valueA > valueB ? -1 : (valueA < valueB ? 1 : 0)
            }
        })
    }
    else if (type === "number") {
        result.sort((a, b) => {
            const valueA = a[field]
            const valueB = b[field]
            if (order === "inc") {
                return valueA > valueB ? 1 : (valueA < valueB ? -1 : 0)
            }
            else if (order === "dec") {
                return valueA > valueB ? -1 : (valueA < valueB ? 1 : 0)
            }
        })
    }
    else if (type === "array") {
        result.sort((a, b) => {
            const valueA = a[field].length
            const valueB = b[field].length
            if (order === "inc") {
                return valueA > valueB ? 1 : (valueA < valueB ? -1 : 0)
            }
            else if (order === "dec") {
                return valueA > valueB ? -1 : (valueA < valueB ? 1 : 0)
            }
        })
    }

    return result
}


export default function Arrange({ type, arrangeKey, setArrangeKey }) {

    // this component used to render arrange icon with functionality
    // we have parameter:
    //  - type: type of array value
    //  - arrangeKey (it will be compare to type): object with two attributes {column, arrange}
    //      column will be compared to type to determine the column need to be arranged
    //      arrange have value inc (increase), dec (decrease) 
    //  - setArrangeKey

    return (
        <div className='arange_icon'>
            <i
                className={
                    "fa-solid fa-angle-up " +
                    (arrangeKey.column === type && arrangeKey.arrange === "inc" && "chosen")
                }
                onClick={(e) => {
                    if (e.currentTarget.className.includes("chosen")) {
                        setArrangeKey({})
                    }
                    else {
                        setArrangeKey({
                            column: type,
                            arrange: "inc"
                        })
                    }
                }}></i>

            <i
                className={
                    "fa-solid fa-angle-down " +
                    (arrangeKey.column === type && arrangeKey.arrange === "dec" && "chosen")
                } onClick={(e) => {
                    if (e.currentTarget.className.includes("chosen")) {
                        setArrangeKey({})
                    }
                    else {
                        setArrangeKey({
                            column: type,
                            arrange: "dec"
                        })
                    }
                }}></i>
        </div>
    )
}