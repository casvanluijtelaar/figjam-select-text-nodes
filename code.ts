/** 
* recursively walk through the selected node tree. and extract all the
* TEXT or SHAPE_WITH_TEXT nodes that actually contain data
*/
function findTextNodes(nodes: readonly SceneNode[]): (TextNode | ShapeWithTextNode)[] {
  let textNodes: (TextNode | ShapeWithTextNode)[] = [];

  for (const node of nodes) {
    if (node.type === "TEXT") {
      if (node.characters.trim().length > 0) textNodes.push(node);
    } else if (node.type === "SHAPE_WITH_TEXT") {
      if (node.text?.characters?.trim().length > 0) textNodes.push(node);
    } else if ("children" in node) {
      textNodes = textNodes.concat(findTextNodes(node.children));
    }
  }

  return textNodes;
}

/**
* take the current selection, and update it to only contain
* the text nodes contained in that selection
*/
function selectTextNodes() {
  const selection = figma.currentPage.selection;
  if (selection.length === 0) return figma.notify("No nodes selected.");

  const textNodes = findTextNodes(selection)
  if (textNodes.length === 0) return figma.notify("No text nodes selected.");

  figma.currentPage.selection = [];
  figma.currentPage.selection = textNodes;
  figma.notify(`Selected ${textNodes.length} text node${textNodes.length > 1 ? 's' : ''}.`);

  figma.closePlugin();
};


selectTextNodes()