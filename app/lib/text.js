export function stripHtml (text) {
    return text.replace(/(<([^>]+)>)/ig, '')
}


export function getSelectionDetails () {
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) return null;

    const range = selection.getRangeAt(0);
    const startContainer = range.startContainer;
    const endContainer = range.endContainer;

    // let checking = document.evaluate(startXPath, document, null, 5, null);
    let top = startContainer.parentElement.getBoundingClientRect().top;
    
    return {
        startOffset: range.startOffset,
        endOffset: range.endOffset,
        text: range.toString(),
        top: top
    };
};