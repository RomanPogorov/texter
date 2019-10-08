import * as React from "react"
import * as ReactDOM from "react-dom"
import * as R from "ramda"
import "./ui.css"
import fakerData from "faker"
import { dataTypes as dataTypesUI } from "./types"
import Select from "react-select"
import { fakerDataTypes } from "./Fakertypes"
import { autoData } from "./Fakertypes"
import { Tab, Tabs, TabList, TabPanel } from "react-tabs"
import "react-tabs/style/react-tabs.css"
import map from "ramda/es/map"

declare function require(path: string): any

window.onmessage = async ({ data }) => {
  if (
    data == null ||
    data.pluginMessage == null ||
    data.pluginMessage.id == null
  )
    return
  const canvas = document.createElement("canvas")
  const ctx = canvas.getContext("2d")
  const image = await new Promise((resolve, reject) => {
    const img = new Image()
    img.crossOrigin = "Anonymous"
    img.onload = () => resolve(img)
    img.onerror = () => reject()
    if (data.pluginMessage.width >= 800) {
      img.src = `https://picsum.photos/1600?=${data.pluginMessage.id}`
    }
    if (data.pluginMessage.width >= 600 && data.pluginMessage.width < 800) {
      img.src = `https://picsum.photos/1000?=${data.pluginMessage.id}`
    }
    if (data.pluginMessage.width < 600 && data.pluginMessage.width > 200) {
      img.src = `https://picsum.photos/800?=${data.pluginMessage.id}`
    }
    if (data.pluginMessage.width <= 200) {
      img.src = `https://picsum.photos/400?=${data.pluginMessage.id}`
    }
  })

  canvas.width = image.width
  canvas.height = image.height
  ctx.drawImage(image, 0, 0)
  const buffer = await new Promise((resolve, reject) => {
    canvas.toBlob(blob => {
      const reader = new FileReader()
      reader.onload = () => resolve(new Uint8Array(reader.result))
      reader.onerror = () => reject(new Error("Could not read from blob"))
      reader.readAsArrayBuffer(blob)
    })
  })
  window.parent.postMessage(
    { pluginMessage: { id: data.pluginMessage.id, buffer } },
    "*"
  )
}

export const TypeChooser = ({ choosed, setChoosed }) => {
  return (
    <form id="myform" name="myform1">
      {Object.keys(dataTypesUI).map(type => (
        <label key={type}>
          <input
            type="radio"
            checked={type === choosed}
            value={type}
            onChange={() => setChoosed(type)}
          />
          {type}
          <div className="example">{dataTypesUI[type][3]}</div>
        </label>
      ))}
    </form>
  )
}
window.onmessage = (event) => {
console.log(event.data.pluginMessage)

}

const Example = ({ autoData, type }) => {
  const example = React.useMemo(() => autoData[type][0](), [type])
  return <div className="example">{example}</div>
}

// console.log(autoData)
export const FakerChooser2 = ({ choosed, setChoosed }) => {
  return (
    <form id="myform" name="myform1">
      {Object.keys(autoData).map(type => (
        <label key={type}>
          <input
            type="radio"
            checked={type === choosed}
            value={type}
            onChange={() => setChoosed(type)}
          />
          {type}
          <Example autoData={autoData} type={type} />
        </label>
      ))}
    </form>
  )
}

let optionsForSelect = []

const createValidObjextFromFaker = function() {
  {
    Object.keys(autoData).map(type =>
      optionsForSelect.push({ value: type, label: type })
    )
  }
}
// console.log(optionsForSelect)
// console.log(fakerData.fake("{{type}}, {{name.firstName}} {{name.suffix}}"))
// console.log(fakerData.fake("{{type}}, {{name.firstName}} {{name.suffix}}"))

const PREPOSITIONS = [",", ".", "(", ")"]

optionsForSelect.push({ value: PREPOSITIONS[0], label: PREPOSITIONS[0] })
optionsForSelect.push({ value: PREPOSITIONS[1], label: PREPOSITIONS[1] })
optionsForSelect.push({ value: PREPOSITIONS[2], label: PREPOSITIONS[2] })
optionsForSelect.push({ value: PREPOSITIONS[3], label: PREPOSITIONS[3] })

createValidObjextFromFaker()

export const FakerChooser = ({ choosed, setChoosed }) => {
  return (
    <form id="myform" name="myform1">
      {Object.keys(fakerDataTypes).map(type => (
        <label key={type}>
          <input
            type="radio"
            checked={type === choosed}
            value={type}
            onChange={() => setChoosed(type)}
          />
          {type}
          <div className="example">{fakerDataTypes[type][3]}</div>
        </label>
      ))}
    </form>
  )
}

const Greetings = () => (
  <div>
    {/* <h5>Texter – goTRG content library</h5> */}
    <p className="desc">
      <a href="https://github.com/marak/faker.js">faker.js </a>- generate
      massive amounts of fake data in the browser and node.js
    </p>
  </div>
)


export const Custom = ({ choosed, setChosed }) => {
  return (
    <form id="myform" name="myform1"></form>
  )
}
// onmessage = (event) => {
//   console.log(event.data.pluginMessage)
//   console.log('asd')
// }

function Button({ className, id, onClick, children }) {
  return (
    <button className={className} id={id} onClick={onClick}>
      {children}
    </button>
  )
}

const onClose = () => {
  parent.postMessage({ pluginMessage: { type: "close" } }, "*")
}

const setLocalStorage = () => {
  parent.postMessage({ pluginMessage: { type: "storage" } }, "*")
}
const checkLocalStorage = () => {
  parent.postMessage({ pluginMessage: { type: "check" } }, "*")
}

const colourStyles = {
  option: (styles, { data: { label } }) => ({
    ...styles,
    color: PREPOSITIONS.indexOf(label) !== -1 ? "#ababab" : "#444"
  }),
  multiValueLabel: (styles, { data: { label } }) => ({
    ...styles,
    paddingRight: 9,
    backgroundColor: PREPOSITIONS.indexOf(label) !== -1 ? "#eaeaea" : "#c3c3c3"
  }),
  multiValueRemove: (styles, { data: { label } }) => ({
    ...styles,
    marginLeft: -3,
    backgroundColor: PREPOSITIONS.indexOf(label) !== -1 ? "#eaeaea" : "#c3c3c3",
    ":hover": {
      backgroundColor:
        PREPOSITIONS.indexOf(label) !== -1 ? "#cacaca" : "#a2a2a2",
      color: PREPOSITIONS.indexOf(label) !== -1 ? "#000" : "#"
    }
  })
}



const App = () => {
  const [choosed, setChoosed] = React.useState(null)
  const [chosedTab, setChosedTab] = React.useState(0)
  const [selectValue, setSelectValue] = React.useState([])
  let [fakerString, setFakerString] = React.useState("")
  const onCreate = React.useCallback(
    () =>
      parent.postMessage(
        { pluginMessage: { type: "create", choosed, chosedTab, fakerString } },
        "*"
      ),

    [choosed, chosedTab, fakerString]
  )
  const addToFavorites = React.useCallback(
    () =>
      parent.postMessage(
        { pluginMessage: { type: "addtofavorites", choosed, chosedTab, fakerString } },
        "*"
      ),

    [choosed, chosedTab, fakerString]
  )

  /*
  fakerData -renameKeys-> fakerWithRenamedKeys -> 


  */

  const onSelectChange = currentValues => {
    const selectedValuesLength = selectValue ? selectValue.length : 0
    const currentValuesLength = currentValues ? currentValues.length : 0

    if (currentValuesLength > selectedValuesLength) {
      const { label, value } = currentValues[currentValues.length - 1]
      if (label === "(") {
        optionsForSelect.unshift({ value: value + "(", label: "(" })
      }
      if (label === ")") {
        optionsForSelect.unshift({ value: value + ")", label: ")" })
      }
      if (label === ".") {
        optionsForSelect.unshift({ value: value + ".", label: "." })
      }
      if (label === ",") {
        optionsForSelect.unshift({ value: value + ",", label: "," })
      }
    }

    optionsForSelect = R.uniqBy(({ label }) => label, optionsForSelect)

    let functionNamesForFakerToFigma = []

    Object.values(currentValues != null && currentValues).map(
      ({ label }) =>
        functionNamesForFakerToFigma.push(label.replace(" / ", "."))
      // console.log(functionNamesForFakerToFigma)
      // optionsForSelect.push({ value: type, label: type })
    )

    // console.log(functionNamesForFakerToFigma)

    setSelectValue(currentValues)
    let fakeStart = `${functionNamesForFakerToFigma
      .map(item =>
        item === "," || item === "." || item === "(" || item === ")"
          ? `${item}`
          : `{{${item}}}`
      )
      .join(" ")}`

    setFakerString((fakerString = fakeStart))
    

    // const withSpaceInEnd = [",", "."]
    // const withoutSpace = ["(", ")"]
    // // console.log(functionNamesForFakerToFigma)
    // const fakeD = functionNamesForFakerToFigma.reduce((acc, v, index, arr) => {
    //   const isSpecial = withSpaceInEnd.includes(v) || withoutSpace.includes(v)
    //   if(index === arr.length - 1) {
    //     if(isSpecial) return [...acc, `{{${v}}}`]
    //     return [...acc, v]
    //   }

    //   if ([',', ')'].includes(arr[index + 1])) {
    //     return [...acc, `${v}`]
    //   }
    //   if (withoutSpace.includes(v)) {
    //     return [...acc, v]
    //   }

    //   return [...acc, ` {{${v}}}`]
    // }, [])
    // // console.log(fakeD)
    // let fakeStart = `fakerData.fake("${fakeD.join("")}")`

    // console.log(fakeStart)

    // let fakeStart = `fakerData.fake("${functionNamesForFakerToFigma
    //   .map(
    //     item => {
    //       switch (item) {
    //       case ',':
    //         `${item}`
    //         break;
    //       case '.':
    //         `${item}`
    //         break;
    //       case '(':
    //         `${item}`
    //         break;
    //       case ')':
    //         `${item}`
    //         break;
    //       default:
    //         `{{${item}}}`
    //     }
    //   }
    //     )
    //     .join("")
    // }")`

    // let fakeStart = `fakerData.fake("${functionNamesForFakerToFigma
    //   .map(item => `{{${item}}}`)}")`

    // functionNamesForFakerToFigma.map(item => console.log(item)
    // console.log(fakeStart)
    // console.log(fakerData.fake("{{name.firstName}}{{name.lastName}},{{name.jobTitle}}({{name.jobDescriptor}})"))

    // var str = functionNamesForFakerToFigma.join('{}');
    // console.log(fakerData.fake("{{address.cityPrefix}}"))
    // fakerData.fake("{{name.lastName}}, {{name.firstName}} {{name.suffix}}");
    // fakerData.fake("{{address.zipCode}}")
  }

  optionsForSelect.sort(function(a, b) {
    var nameA = a.value.toLowerCase(),
      nameB = b.value.toLowerCase()
    if (nameA < nameB)
      //sort string ascending
      return -1
    if (nameA > nameB) return 1
    return 0 //default return value (no sorting)
  })

  const renderSelectedValues = () =>
    selectValue &&
    selectValue.map(({ value, label }) => {
      if (label == "," || label == "." || label == "(" || label == ")") {
        return (
          <div key={value} className="example">
            {label}
          </div>
        )
      }
      // const functionNameArray = label.split("/")
      // console.log({autoData}, {label})
      return <Example key={value} autoData={autoData} type={label} />
    })

  return (
    <div>
      {/* <Greetings /> */}
      <Tabs onSelect={val => setChosedTab(val)}>
        <TabList>
          {/* <Tab>TRG Content</Tab> */}
          <Tab>Faker.js</Tab>
          <Tab>Custom</Tab>
          <Tab>Images</Tab>
        </TabList>

        {/* <TabPanel>
          <TypeChooser choosed={choosed} setChoosed={setChoosed} />
        </TabPanel> */}
        <TabPanel>
          <Greetings />
          <FakerChooser2 choosed={choosed} setChoosed={setChoosed} />
        </TabPanel>
        <TabPanel>
          <div className="custom">
            <Select
              value={selectValue}
              onChange={onSelectChange}
              options={optionsForSelect}
              isMulti
              styles={colourStyles}
            />
          </div>
          <div className="customExample">{renderSelectedValues()}</div>
          <div><Custom /></div>
        </TabPanel>
        <TabPanel>
          <Greetings />
        </TabPanel>
      </Tabs>
      <div className="fixed">
        <Button
          className="button button-primary"
          id="create"
          onClick={onCreate}
        >
          Replace
        </Button>
        <Button className="button" id="close" onClick={onClose}>
          Close
        </Button>
        <Button className="button" id="addtofavorites" onClick={addToFavorites}>
          Set storage
        </Button>

        <Button
          className="button"
          id="storageCheck"
          onClick={checkLocalStorage}
        >
          Check storage
        </Button>
      </div>
    </div>
  )
}

ReactDOM.render(<App />, document.getElementById("react-page"))
