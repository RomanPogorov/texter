import fakerData from "faker"

export const fakerDataTypesAll = {
  // fakerData.address
}


const rootKeys = Object.keys(fakerData)
const rootValues = Object.values(fakerData)
const objFuncs = {}
// const fakerDefs = fakerData.definitions

let allKeys = {}


let bag = []
Object.keys(fakerData).forEach((value, index) => {
  if (typeof fakerData[value] != "object") return
  // console.log(fakerData[value])
  if (typeof fakerData[value] != "object") return
  let secondLevel = Object.keys(fakerData[value])
  // console.log(secondLevel)

  for (let [key, value] of Object.entries(secondLevel)) {
    // console.log(`${key}: "${value}",`);
    // bag.push(`${key}: "${value}",`)
  }
  // Object.values(secondLevel).forEach((svalue, index) => {
  // console.log(svalue);
  // })

  // bag.push(Object.keys(fakerData[value])[index])
})

// console.log(bag)

for (let [key, value] of Object.entries(fakerData)) {
  // if (typeof(fakerData[rootKey]) != "object") return
  // console.log(`${key[value]}: ${value}`);
}

const fuck = {
  // "Name + Lastname": Array.from({ length: 20 }).map(() =>
  //   fakerData.fake("{{name.firstName}} {{name.lastName}}")
  // )
}

// console.log(fuck)
rootKeys.forEach((key, index) => {
  const nestedFunctions = Object.keys(fakerData[key])
  if (
    key != "locales" &&
    key != "locale" &&
    key != "localeFallback" &&
    key != "definitions" &&
    key != "fake" &&
    key != "random" &&
    key != "helpers" &&
    key != "image"
  ) {
    nestedFunctions.forEach((key2, index) => {
      // console.log(`${key} / ${key2}`)
      if (
        `${key} / ${key2}` != "company / suffixes" &&
        `${key} / ${key2}` != "date / between" &&
        `${key} / ${key2}` != "date / future" &&
        `${key} / ${key2}` != "date / past" &&
        `${key} / ${key2}` != "date / recent" &&
        `${key} / ${key2}` != "system / directoryPath" &&
        `${key} / ${key2}` != "internet / avatar" &&
        `${key} / ${key2}` != "system / filePath"
      ) {
        //вместо массива значений хранить массив функций и запускать их все по клику на таб
        fuck[`${key} / ${key2}`] = Array.from({ length: 20 }).map(() =>
          fakerData[key][key2]
        )
      }
    })
  }
})

console.log(fuck)

export const autoData = fuck

const qty = 10
export const fakerDataTypes = {
  "Sale Price": Array.from({ length: qty }).map(
    () => "USD " + fakerData.commerce.price()
  ),
  ZipCode: Array.from({ length: qty }).map(() => fakerData.address.zipCode()),
  City: Array.from({ length: qty }).map(() => fakerData.address.city()),
  cityPrefix: Array.from({ length: qty }).map(() =>
    fakerData.address.cityPrefix()
  ),
  citySuffix: Array.from({ length: qty }).map(() =>
    fakerData.address.citySuffix()
  ),
  streetName: Array.from({ length: qty }).map(() =>
    fakerData.address.streetName()
  ),
  streetAddress: Array.from({ length: qty }).map(() =>
    fakerData.address.streetAddress()
  ),
  streetSuffix: Array.from({ length: qty }).map(() =>
    fakerData.address.streetSuffix()
  ),
  streetPrefix: Array.from({ length: qty }).map(() =>
    fakerData.address.streetPrefix()
  ),
  secondaryAddress: Array.from({ length: qty }).map(() =>
    fakerData.address.secondaryAddress()
  ),
  countryCode: Array.from({ length: qty }).map(() =>
    fakerData.address.countryCode()
  ),
  state: Array.from({ length: qty }).map(() => fakerData.address.state()),
  stateAbbr: Array.from({ length: qty }).map(() =>
    fakerData.address.stateAbbr()
  ),
  latitude: Array.from({ length: qty }).map(() => fakerData.address.latitude()),
  longitude: Array.from({ length: qty }).map(() =>
    fakerData.address.longitude()
  )
}
