// life would have been alot easier if a "WORLD CLASS" university actually provided this publicly
// Maybe it exists but i can't just find it...
const COURSE_CODES = [
    "PEB102", "PEB104", "PEB106", "ZLY104", "ZLY106", "GEM102", "MAT102", "MAT104", "MAT106", "LIS102", "LIS104", "LIS106", "LIN106", "LIN104", "LIN108", "BED102", "BED104", "BED106", "BED108", "SPE104", "SPE106", "SPE108", "ENG102", "ENG104", "ENG106", "ENG108", "BFN106", "CDS102", "CDS104", "CDS106", "CDS108", "EDS110", "FRN104", "FRN106", "FRN108", "THE102", "CHS102", "CHS104", "CHS106", "FIN102", "FIN104", "FIN108", "POL102", "POL104", "POL106", "GNS102", "GNS104", "GNS106", "SMS102", "ACC102",
    "PHY102", "PHY104", "PHY106", "PHY108", "STA102", "STA104", "STA106", "AGR102", "MAC102", "MAC104", "MAC108", "CSC102", "ECP102", "ECP104", "ECP106", "ECP108", "HKE108", "LIY102", "LIY104", "ARB102", "ARB106", "ARB108", "PVA102", "LAN102", "LAN104", "CHS108", "BUS106", "BUS108", "ACC104", "ACC106", "ACC108",
    "ILS102", "ILS108", "ILS106", "ILS104", "ECN102", "ECN104", "ECM104", "HIS102", "HIS104", "HIS106", "HIS108", "THE104","THE108", "BSE104", "PAD102", "PAD106", "PAD108", "VPA102", "ISN104", "ISN106", "FVA102", "FVA104",

    "CHM112", "MAC114", "EDU112", "ECN112", "ECN114", "EDS110", "POL110", "POL112", "HKE110", "HKE112", "HKE114", "SFL114", "LIN110", "LIN112", "LIN114", "BED110", "BED112",
    "BED114", "BED116", "BSE110", "BSE112", "PVA114", "SPE110", "CPS110", "ENG110", "ENG112", "ARB104", "ARB110", "ARB112", "ARB114", "ARB116", "ARB118", "PAD110", "PAD112", "PAD114", "HIS110", "HIS112", "HIS114", "FRN112",
    "ILS110",

]

class App {
    constructor() {
        this.dataValues = {};
        this.initialize();
        this.initializeEvents();
    }

    initialize() {
        this.elMainSectionsContainer = document.getElementById("sections-container");
        this.sectionsCount = this.elMainSectionsContainer.children.length;
        // this.currentViewSectionIndex = this.sectionsCount - 1;
        this.currentViewSectionIndex = 0;
        this.elBtnNavNext = document.getElementById("btn-nav-next");
        this.elBtnNavPrev = document.getElementById("btn-nav-prev");

        this.elInputSubmitDownload = document.getElementById("input-submit-download");
        this.elInputFileProfileImage = document.getElementById("input-file-profile-image");
        this.elProfileImageContainer = document.querySelector("#profile-picture-container .image-border");
        
        const subjectSelectInputs = document.getElementsByClassName("subject-select");
        const sortedCourseCodes = COURSE_CODES.sort();
        Array.from(subjectSelectInputs).forEach(element => {
            const optionBlank = document.createElement("option");
            optionBlank.value = "";
            optionBlank.innerText = "";
            optionBlank.selected = true;
            element.appendChild(optionBlank);

            sortedCourseCodes.forEach(courseCode => {
                const optionCourseCode = document.createElement("option");
                optionCourseCode.value = courseCode;
                optionCourseCode.innerText = courseCode;
                element.appendChild(optionCourseCode);
            });
        });

        this.setViewSection();
    }

    initializeEvents() {
        this.elBtnNavNext.addEventListener("click", event => {
            this.setNextViewSection();
        });

        this.elBtnNavPrev.addEventListener("click", event => {
            this.setPrevViewSection();
        });

        this.elInputFileProfileImage.addEventListener("change", event => {
            if (event.target.files.length > 0) {
                this.updateProfileImage(event.target.files[0]);
            }
        });

        this.elInputSubmitDownload.addEventListener("click", event => {
            event.preventDefault();
            this.openDocumentWindow();
        });
        const dataValueInputs = document.querySelectorAll("input[data-value-input], select[data-value-input], textarea[data-value-input]");
        const dataValueInputGroups = document.querySelectorAll("input[data-value-input-group], select[data-value-input-group]");

        Array.from(dataValueInputs).forEach(dataValueInput => {
            this.dataValues[dataValueInput.id] = encodeURI(dataValueInput.value);
            dataValueInput.addEventListener("change", () => {
                this.dataValues[dataValueInput.id] = encodeURI(dataValueInput.value);
            });
        });

        Array.from(dataValueInputGroups).forEach(dataValueInputGroupInput => {
            if (!dataValueInputGroupInput.hasAttribute("data-value-input-group") || !dataValueInputGroupInput.hasAttribute("data-value-input-group-index")) {
                return;
            }
            const group = dataValueInputGroupInput.getAttribute("data-value-input-group");
            const groupIndex = parseInt(dataValueInputGroupInput.getAttribute("data-value-input-group-index"));
            if (typeof this.dataValues[group] === "undefined") {
                this.dataValues[group] = [];
            } else if (groupIndex >= this.dataValues[group].length) {
                for (let i = 0; i < groupIndex - this.dataValues[group].length + 1; i++) {
                    this.dataValues[group].push("");
                }
            }
            this.dataValues[group][groupIndex] = encodeURI(dataValueInputGroupInput.value);
            dataValueInputGroupInput.addEventListener("change", () => {
                this.dataValues[group][groupIndex] = encodeURI(dataValueInputGroupInput.value);
            });
        });

    }

    updateProfileImage(imageFile) {
        const imageSize = 110;
        let elImg = this.elProfileImageContainer.querySelector("img");
        if (elImg == null) {
            elImg = document.createElement("img");
            this.elProfileImageContainer.appendChild(elImg);
        }

        let canvas = this.elProfileImageContainer.querySelector("canvas");
        if (canvas == null) {
            canvas = document.createElement("canvas");
            canvas.width = imageSize;
            canvas.height = imageSize;
            this.elProfileImageContainer.appendChild(canvas);
        }

        const context = canvas.getContext("2d");
        context.clearRect(0, 0, imageSize, imageSize);
        createImageBitmap(imageFile, {
            resizeWidth: imageSize,
            resizeHeight: imageSize
        }).then(result => {
            context.drawImage(result, 0, 0, 110, 110);
            const canvasData = canvas.toDataURL("image/jpeg", 0.5);
            this.dataValues["input-profile-picture-data"] = canvasData;
            elImg.src = canvasData;
        });
    }

    openDocumentWindow() {
        const data = {};
        Object.keys(this.dataValues).forEach(key => {
            const type = typeof this.dataValues[key];
            const valueKey = key.replace("input-", "value-");
            if (type === "string" && this.dataValues[key].trim().length > 0) {
                data[valueKey] = this.dataValues[key];
            } else if (type === "object") {
                const arr = this.dataValues[key].filter(value => {
                    return value.trim().length > 0;
                });
                if (arr.length > 0) {
                    data[valueKey] = arr;
                }
            }
        });
        
        window.open("templates/default.html#" + btoa(JSON.stringify(data)));
    }

    setViewSection(index = undefined) {
        if (typeof index === "undefined") {
            index = this.currentViewSectionIndex;
        }
        this.currentViewSectionIndex = Math.max(0, Math.min(index, this.sectionsCount - 1));
        const currentActiveView = this.elMainSectionsContainer.querySelector("section[data-section-active]");
        if (currentActiveView != null) {
            currentActiveView.removeAttribute("data-section-active");
        }
        this.elMainSectionsContainer.children[this.currentViewSectionIndex].setAttribute("data-section-active", null);
        if (index == 0) {
            this.elBtnNavPrev.style = "transform: scale(0);";
        } else {
            this.elBtnNavPrev.style = "";
        }

        if (index == this.sectionsCount - 1) {
            this.elBtnNavNext.style = "transform: scale(0);";
        } else {
            this.elBtnNavNext.style = "";
        }
    }

    setNextViewSection() {
        this.setViewSection(this.currentViewSectionIndex + 1);
    }

    setPrevViewSection() {
        this.setViewSection(this.currentViewSectionIndex - 1);
    }
}
(new App());