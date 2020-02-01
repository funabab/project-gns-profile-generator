class DocumentWindow {
    constructor() {
        this.initialize();
    }

    initialize() {
        this.elMain = document.getElementsByTagName("main")[0];
        this.elMainBoundindRect = this.elMain.getBoundingClientRect();
        this.elDownloadingStatusContainer = document.createElement("div");
        this.elDownloadingStatusSpan = document.createElement("span");
        this.elDownloadingStatusContainer.appendChild(this.elDownloadingStatusSpan);
        this.elDownloadingStatusContainer.setAttribute("data-downloading-status-container", null);
        this.outputPDF();
    }

    outputMessage(message) {
        const statusContainer = document.querySelector("div[data-downloading-status-container]");
        this.elDownloadingStatusSpan.innerHTML = message;
        if (statusContainer == null) {
            document.body.appendChild(this.elDownloadingStatusContainer);
            document.body.setAttribute("data-download-started", null);
        }
        console.log(message);
    }


    outputPDF() {
        if (location.hash.trim().length <= 1) {
            this.outputMessage("Error no data was provided!");
            return;
        }
        try {
            const data = JSON.parse(atob(location.hash.slice(1)));
            Object.keys(data).forEach(key => {
                const type = typeof data[key];
                const element = document.getElementById(key);
                if (element === null) {
                    return;
                }

                const elementType = element.tagName.toLocaleLowerCase();
                const elParent = element.hasAttribute("data-value-hide-empty-container") ? document.getElementById(element.getAttribute("data-value-hide-empty-container")) : null;
                let isEmpty = true;

                if (type === "string") {
                    if (elementType === "img") {
                        element.src = data[key];
                    } else {
                        isEmpty = data[key].length === 0;
                        element.innerText = decodeURI(data[key]);
                    }
                } else if (type === "object") {
                    isEmpty = data[key].length === 0;
                    if (elementType === "ul") {
                        data[key].forEach(value => {
                            const elLi = document.createElement("li");
                            elLi.innerText = decodeURI(value);
                            element.appendChild(elLi);
                        });
                    } else if (elementType === "tr") {
                        data[key].forEach((value, index) => {
                            const elTd = element.children[index + 1];
                            elTd.innerText = decodeURI(value);
                        });
                    }
                }

                if (elParent != null && !isEmpty) {
                    elParent.style = "display: block;";
                }
            });

            html2canvas(this.elMain, {
                x: this.elMainBoundindRect.x,
                y: 0,
                onclone: () => {
                    this.outputMessage(`Download as started, if download fail to start <a href="" onclick="javascript:reload(true);">click here</a>`);
                }
                
            }).then(canvas => {
                const canvasImageData = canvas.toDataURL();
                const jspdf = new jsPDF({
                    format: "a4",
                    unit: "in"
                });
                // a4 size in inches
                // width: 8.268
                // height: 11.693
                // here we are subtracting the margin 0.15 from the size

                jspdf.addImage(canvasImageData, "PNG", 0.15, 0.15, 7.968, 11.393, undefined, "SLOW", 0);
                jspdf.save();
            });
        } catch (e) {
            this.outputMessage("An error occured while generating document.");
        }
    }
}
(new DocumentWindow());