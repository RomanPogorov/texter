import { dataTypes } from "./types"
import fakerData from "faker"
import { autoData } from "./Fakertypes"
figma.showUI(__html__, { width: 640, height: 680 })

const mySelection = figma.currentPage.selection

function digger(node, fn) {
  if (node == null) return
  fn(node)
  if (node.children == null) return
  for (const child of node.children) {
    digger(child, fn)
  }
}

async function asyncDigger(node, fn) {
  if (node == null) {
    return
  }
  await fn(node)
  if (node.children == null) return
  for (const child of node.children) {
    await asyncDigger(child, fn)
  }
}

async function getLocalStorage(key) {
  const res = await figma.clientStorage.getAsync(key)
  // console.log(res)
  return res
}




const generalFun = async msg => {
  if (msg.type === "close") {
    figma.closePlugin()
    return
  }

  // localStorage.setItem('favorites', msg.fakerString);

  if (msg.type === "addtofavorites") {
    // console.log(msg.fakerString);
    const prev = await getLocalStorage("favorites")
    // figma.ui.postMessage({ prev })
    await figma.clientStorage.setAsync('favorites', prev ? [...prev, msg.fakerString] : [msg.fakerString])
    return
  }

  if (msg.type === "check") {
    await figma.clientStorage.setAsync('favorites', '')
    // async function getLocalStorage(key) {
    //   let sss = await figma.clientStorage.getAsync(key)
    //   // console.log(sss)
    // }
    // getLocalStorage("texter")
    return
  }
  const lStorage = getLocalStorage("favorites")
  console.log(lStorage)

  figma.ui.postMessage (lStorage)
  

  if (msg.type === "create" && msg.chosedTab === 0) {
    figma.currentPage.selection.forEach(async selection => {
      async function doSomething(child) {
        if (child.type == "TEXT") {
          await figma.loadFontAsync(child.fontName)
          let selectedItem = msg.choosed
          child.characters =
            dataTypes[selectedItem][
              Math.floor(Math.random() * dataTypes[selectedItem].length)
            ]
        }
      }
      digger(selection, doSomething)
    })
  }

  if (msg.type === "create" && msg.chosedTab === 2) {
    figma.currentPage.selection.forEach(async selection => {
      async function doSomething(child) {
        if (child.type == "TEXT") {
          await figma.loadFontAsync(child.fontName)
          let selectedItem = msg.choosed
          console.log(msg.fakerString);
          
          msg.fakerString !== '' ? child.characters = fakerData.fake(msg.fakerString) : child.characters = child.characters
        }
      }
      digger(selection, doSomething)
    })
  }

  if (msg.type === "create" && msg.chosedTab === 1) {
    figma.currentPage.selection.forEach(async selection => {
      async function doSomething(child) {
        if (child.type == "TEXT") {
          await figma.loadFontAsync(child.fontName)
          let selectedItem = msg.choosed
          child.characters = autoData[selectedItem][0]()
        }
      }
      digger(selection, doSomething)
    })
  }

  if (msg.type === "create" && msg.chosedTab === 3) {
    for (let selection of figma.currentPage.selection) {
      await asyncDigger(selection, mapNodes)
    }
  }
}

async function setFill({ id, fills: [fill], width, height }) {
  const newBytes: Uint8Array = await new Promise((resolve, reject) => {
    figma.ui.postMessage({ id, width, height })
    figma.ui.onmessage = value => resolve(value.buffer as Uint8Array)
  })

  figma.ui.onmessage = generalFun
  const aaa = figma.createImage(newBytes)
  const scaleMode = (fill || {}).scaleMode || "FILL"
  return { type: "IMAGE", scaleMode: scaleMode, imageHash: aaa.hash }
}

async function mapNodes(node) {
  switch (node.type) {
    case "RECTANGLE":
    case "ELLIPSE":
    case "POLYGON":
    case "STAR":
    case "VECTOR":
    case "TEXT": {
      node.fills = [await setFill(node)]
    }

    default: {
    }
  }
}

figma.ui.onmessage = generalFun
