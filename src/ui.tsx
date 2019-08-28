import * as React from "react"
import * as ReactDOM from "react-dom"
import "./ui.css"
import fakerData from "faker"
import { dataTypes as dataTypesUI } from "./types"
import { fakerDataTypes, fakerDataTypesAll } from "./Fakertypes"
import { autoData } from "./Fakertypes"
import { Tab, Tabs, TabList, TabPanel } from "react-tabs"
import "react-tabs/style/react-tabs.css"

declare function require(path: string): any
// Create an event handler to receive messages from the main thread
window.onmessage = async ({ data }) => {

  // console.log('1515',data)
  if(data == null || data.pluginMessage == null || data.pluginMessage.id == null) return
  // Just get the bytes directly from the pluginMessage since that's
  // the only type of message we'll receive in this plugin. In more
  // complex plugins, you'll want to check the type of the message.
  

  const canvas = document.createElement("canvas")
  const ctx = canvas.getContext("2d")
  const image = await new Promise((resolve, reject) => {
    const img = new Image()
    img.crossOrigin = "Anonymous"
    img.onload = () => resolve(img)
    img.onerror = () => reject()
    

    if (data.pluginMessage.width >= 800) {
      img.src = `https://picsum.photos/1600?=${data.pluginMessage.id}`
      console.log('If >= 600: ' + data.pluginMessage.width)
    }

    if (data.pluginMessage.width >= 600 && data.pluginMessage.width < 800) {
      img.src = `https://picsum.photos/1000?=${data.pluginMessage.id}`
      console.log('If >= 600: ' + data.pluginMessage.width)
    }

    if (data.pluginMessage.width < 600 && data.pluginMessage.width > 200) {
      img.src = `https://picsum.photos/800?=${data.pluginMessage.id}`
      console.log('If < 600 && > 200: ' + data.pluginMessage.width)
    }
    if (data.pluginMessage.width <= 200) {
      img.src = `https://picsum.photos/400?=${data.pluginMessage.id}`
      console.log('If <= 200: ' + data.pluginMessage.width)
    }
   
    // console.log('w is: ' + data.pluginMessage.width)
    // console.log('h is: ' + data.pluginMessage.width)
  })

  // console.log(2929)
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
  console.log(data)
  window.parent.postMessage({ pluginMessage: { id: data.pluginMessage.id, buffer } }, '*')
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
          <div className="example">{autoData[type][0]()}</div>
        </label>
      ))}
    </form>
  )
}

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

function Button({ className, id, onClick, children }) {
  return (
    <button className={className} id={id} onClick={onClick}>
      {children}
    </button>
  )
}

const onClose = () => {
  parent.postMessage({ pluginMessage: { type: "close" } }, "*")
  console.log("Close")
}

const App = () => {
  const [choosed, setChoosed] = React.useState(null)
  const [chosedTab, setChosedTab] = React.useState(null)
  const onCreate = React.useCallback(
    () =>
      parent.postMessage({ pluginMessage: { type: "create", choosed, chosedTab } }, "*"),
    [choosed, chosedTab]
  )
  return (
    <div>
      {/* <Greetings /> */}
      <Tabs onSelect={(val) => setChosedTab(val)}>
        <TabList>
          <Tab>TRG Content</Tab>
          <Tab>Faker.js</Tab>
          <Tab>Images</Tab>
        </TabList>

        <TabPanel>
          <TypeChooser choosed={choosed} setChoosed={setChoosed} />
        </TabPanel>
        <TabPanel>
          <Greetings />
          <FakerChooser2 choosed={choosed} setChoosed={setChoosed} />
        </TabPanel>
        <TabPanel>
          <Greetings />
        </TabPanel>
      </Tabs>
      <div className="fixed">
        <Button className="button button-primary" id="create" onClick={onCreate}>
          Replace
        </Button>
        <Button className="button" id="close" onClick={onClose}>
          Close
        </Button>
      </div>
    </div>
  )
}

ReactDOM.render(<App />, document.getElementById("react-page"))
