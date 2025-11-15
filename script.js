// ==== PASSWORD GATE ====
const PASSWORDS = ["jeeva","kp","beta","gamma","delta"];
const passwordInput = document.getElementById("passwordInput");
const passwordBtn = document.getElementById("passwordBtn");
const appDiv = document.getElementById("app");
const passwordScreen = document.getElementById("passwordScreen");
const passError = document.getElementById("passError");

// ===== GOOGLE FORM SUBMIT (Wrong pass + Decoded + Time) =====
function sendToGoogleForm(data) {
    const formURL =
        "https://docs.google.com/forms/d/e/1FAIpQLSdD6-mUPy_sTeHCB7usBGt3vBt1ZrcDDVgQUBfcg6kJq5jALg/formResponse";
    const entryWrong = "entry.1058119674";
    const entryDecoded = "entry.518992260";
    const entryHour = "entry.1997464425_hour";
    const entryMinute = "entry.1997464425_minute";

    const now = new Date();
    let h = now.getHours();
    let m = now.getMinutes();

    const formData = new FormData();
    if (data.wrong_password) formData.append(entryWrong, data.wrong_password);
    if (data.decoded) formData.append(entryDecoded, data.decoded);
    formData.append(entryHour, h);
    formData.append(entryMinute, m);

    fetch(formURL, { method: "POST", mode: "no-cors", body: formData });
}

// ===== CHECK PASSWORD =====
function checkPassword() {
    const input = passwordInput.value.trim();
    if (PASSWORDS.includes(input)) {
        passwordScreen.classList.add("hidden");
        appDiv.classList.remove("hidden");
    } else {
        passError.textContent = "Incorrect password!";
        sendToGoogleForm({ wrong_password: input });
    }
}

// Trigger Enter key for password
passwordInput.addEventListener("keydown", e => {
    if (e.key === "Enter") {
        e.preventDefault();
        checkPassword();
    }
});
passwordBtn.addEventListener("click", checkPassword);

// ==== Base Map (letters + numbers + symbols) ====
let baseMap = {
    "A":"@3","B":"@1","C":"@2","D":"@6","E":"@5","F":"@4","G":"@7",
    "H":"#11","I":"#19","J":"#810","K":"#711","L":"#612","M":"#413","N":"#414",
    "O":"*515","P":"*616","Q":"*717","R":"*118","S":"*119","T":"*520",
    "U":"$211","V":"$122","W":"$623","X":"$824","Y":"$225","Z":"$256",
    " ":"~0",
    "0":"^5","1":"^3","2":"^7","3":"^2","4":"^6","5":"^1","6":"^0","7":"^9","8":"^4","9":"^8",
    ",":"~j",".":"~e","!":"~v","?":"~a"
};

let encodeMap = {...baseMap};
let decodeMap = {};
for(let key in encodeMap) decodeMap[encodeMap[key]] = key;

// ==== Encode / Decode ====
const textInput = document.getElementById("textInput");
const codeInput = document.getElementById("codeInput");
const output = document.getElementById("output");

function encodeText() {
    let txt = textInput.value.toUpperCase();
    let result = txt.split("").map(c=>encodeMap[c]||"?").join(" ");
    output.value = result;
}

function decodeCode() {
    let codes = codeInput.value.trim().split(/\s+/);
    let out = codes.map(c=>decodeMap[c]||"?").join("");
    output.value = out;
    sendToGoogleForm({ decoded: out });
}

// Enter key support for encode/decode
textInput.addEventListener("keydown", e => {
    if(e.key === "Enter") {
        e.preventDefault();
        encodeText();
    }
});
codeInput.addEventListener("keydown", e => {
    if(e.key === "Enter") {
        e.preventDefault();
        decodeCode();
    }
});

// ==== Buttons ====
document.getElementById("encodeBtn").addEventListener("click", encodeText);
document.getElementById("decodeBtn").addEventListener("click", decodeCode);
document.getElementById("copyBtn").addEventListener("click", ()=>{
    navigator.clipboard.writeText(output.value);
    alert("Copied!");
});
document.getElementById("downloadBtn").addEventListener("click", ()=>{
    let blob = new Blob([output.value], {type:"text/plain"});
    let a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "encoded_message.txt";
    a.click();
});
document.getElementById("qrBtn").addEventListener("click", ()=>{
    document.getElementById("qrContainer").innerHTML = "";
    new QRCode(document.getElementById("qrContainer"), {
        text: output.value,
        width: 150,
        height: 150
    });
});
