async function recursiveCopy(node, targetParentId) {
  if (!node.title && !node.url) return;

  const newNode = await browser.bookmarks.create({
    parentId: targetParentId,
    title: node.title,
    url: node.url
  });

  if (node.children && node.children.length > 0) {
    for (const child of node.children) {
      await recursiveCopy(child, newNode.id);
    }
  }
}

async function startSync() {
  console.log("Iniciando copia de marcadores...");
  
  try {
    const menuTree = await browser.bookmarks.getSubTree("menu________");
    const items = menuTree[0].children;

    for (const item of items) {
      await recursiveCopy(item, "toolbar_____");
    }
    
    console.log("Sincronización inicial completada.");
  } catch (error) {
    console.error("Error en la sincronización:", error);
  }
}

browser.runtime.onStartup.addListener(startSync);
browser.runtime.onInstalled.addListener(startSync);
