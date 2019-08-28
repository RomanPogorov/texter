import { dataTypes } from "./types"
import { autoData } from "./Fakertypes"
figma.showUI(__html__, { width: 440, height: 680 })

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


const generalFun = async msg => {
  console.log(msg)
  if (msg.type === "close") {
    figma.closePlugin()
    return
  }

  if (msg.type === "create" && msg.chosedTab === 1) {
    figma.currentPage.selection.forEach(async selection => {
      async function doSomething(child) {
        if (child.type == "TEXT") {
          await figma.loadFontAsync(child.fontName)
          let selectedItem = msg.choosed
          child.characters =
            autoData[selectedItem][0
              // Math.floor(Math.random() * autoData[selectedItem].length)
            ]()
        }
      }
      digger(selection, doSomething)
    })

    // This plugin looks at all the currently selected nodes and inverts the colors
    // in their image, if they use an image paint.
    
  }
  if(msg.type === "create" && msg.chosedTab === 2) {
    for(let selection of figma.currentPage.selection) {
      await asyncDigger(selection, mapNodes)
      // console.log(selection)
    }
  }
  console.log('end')

}

async function setFill({id, fills:[fill], width, height}) {
  // console.log('setFill')
  // Only invert the color for images (but you could do it
  // for solid paints and gradients if you wanted)
  // console.log(11111, id)
  // Wait for the worker's response

  const newBytes: Uint8Array = await new Promise((resolve, reject) => {
    figma.ui.postMessage({ id, width, height })
    figma.ui.onmessage = (value) => resolve(value.buffer as Uint8Array)
  })

  figma.ui.onmessage = generalFun
  

  // Create a new paint for the new image. Uploading the image will give us
  // an image hash.
  console.log(newBytes)
  const aaa = figma.createImage(newBytes)
  const scaleMode = (fill || {}).scaleMode || 'FILL'
  return { type: 'IMAGE', scaleMode: scaleMode, imageHash: aaa.hash }
}

async function mapNodes(node) {
  // Look for fills on node types that have fills.
  // An alternative would be to do `if ('fills' in node) { ... }
  // console.log(node.type, node.id)
  switch (node.type) {
    case "RECTANGLE":
    case "ELLIPSE":
    case "POLYGON":
    case "STAR":
    case "VECTOR":
    case "TEXT": {
      // Create a new array of fills, because we can't directly modify the old one
      
      // console.log('8181', t)
      node.fills = [await setFill(node)]
      
    }

    default: {
      // not supported, silently do nothing
    }
  }
}


figma.ui.onmessage = generalFun
