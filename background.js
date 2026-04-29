const targetUrl = "http://localhost:8091/automacao/";
const abasAgendadas = new Set();

function agendarFechamento(tabId, url) {
  if (!url) return;

  if (url.startsWith(targetUrl) && !abasAgendadas.has(tabId)) {
    console.log("Aba detectada cedo:", url);

    abasAgendadas.add(tabId);

    setTimeout(() => {
      chrome.tabs.remove(tabId, () => {
        if (chrome.runtime.lastError) {
          console.log("A aba já estava fechada.");
        } else {
          console.log("Aba fechada após 3 segundo!");
        }
        abasAgendadas.delete(tabId);
      });
    }, 3000);
  }
}

//
// Antes da navegação iniciar
//
chrome.webNavigation.onBeforeNavigate.addListener((details) => {
  // Ignora iframes (só aba principal)
  if (details.frameId !== 0) return;

  agendarFechamento(details.tabId, details.url);
});

//
// Fallback
//
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === "loading") {
    agendarFechamento(tabId, tab.pendingUrl || tab.url);
  }
});

//
// Limpeza
//
chrome.tabs.onRemoved.addListener((tabId) => {
  abasAgendadas.delete(tabId);
});