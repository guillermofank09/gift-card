const parse = require('csv-parse')
const fs = require('fs')

const fileName = process.argv[2]
const balance = process.argv[3]

const csvData = []
const results = []

const binarySearch = (list, value) => {
    let first = 0
    let last = list.length - 1
    let position = -1
    let found = false
    let middle
 
    while (found === false && first <= last) {
        middle = Math.floor((first + last)/2)
        if (list[middle] == value) {
            found = true
            position = middle
        } else if (list[middle] > value) { 
            last = middle - 1
        } else {
            first = middle + 1;
        }
    }
    return position
}

// I chose the binary search (limits are between 500 and 10000 using the existing file)

const calculateSum = (list, balance) => {
    for (i = 0; i < list.length; i++) {
        index = binarySearch(list, parseInt(balance))
        if (index >= 0) { 
            if (list[i+1] + list[i] <= parseInt(balance)) {
                results.push({ gift1: list[i+1], gift2: list[i]})
            }
        }
    }
    return false
}

// This is another search option using 2 pointers

/* const calculateSum = (list, balance) => {
    let start = 0, end = list.length - 1
    while (start < end) {
        let sum = list[start] + list[end]
        if (sum <= parseInt(balance)) {
            results.push({ gift1: list[start], gift2: list[end]})
            return true
        }
        else if (sum < balance) start++
        else end--
    }
    return false
} */

fs.createReadStream(__dirname + fileName).pipe(parse({delimiter: ','})).
    on('data', (dataRow) => csvData.push({id: dataRow[0], balance: dataRow[1]})).
    on('end', ()  => {
        const values = csvData.map(item => parseInt(item.balance))
        calculateSum(values, balance)
        if(results.length > 0 ){
            console.log('The results are: ')
            console.log(results)
        } else {
            console.log('Ops, there no results for your gift card balance')
        }
        
    })


