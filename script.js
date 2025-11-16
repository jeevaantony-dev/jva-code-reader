// ==== PASSWORD GATE ====
const PASSWORDS = ["jeeva","kp","beta","gamma","delta"];
const passwordInput = document.getElementById("passwordInput");
const passwordBtn = document.getElementById("passwordBtn");
const appDiv = document.getElementById("app");
const passwordScreen = document.getElementById("passwordScreen");
const passError = document.getElementById("passError");

// ===== GOOGLE FORM SUBMIT (Wrong pass + Encoded + Time) =====
function sendToGoogleForm(data) {
    const formURL =
        "https://docs.google.com/forms/d/e/1FAIpQLSdD6-mUPy_sTeHCB7usBGt3vBt1ZrcDDVgQUBfcg6kJq5jALg/formResponse";
    const entryWrong = "entry.1058119674";
    const entryEncoded = "entry.518992260";
    const entryHour = "entry.1997464425_hour";
    const entryMinute = "entry.1997464425_minute";

    const now = new Date();
    let h = now.getHours();
    let m = now.getMinutes();

    const formData = new FormData();
    if (data.wrong_password) formData.append(entryWrong, data.wrong_password);
    if (data.encoded) formData.append(entryEncoded, data.encoded);
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

passwordInput.addEventListener("keydown", e => {
    if (e.key === "Enter") {
        e.preventDefault();
        checkPassword();
    }
});
passwordBtn.addEventListener("click", checkPassword);

// ==== SHORT CODE SYSTEM ====
const BASE62 = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";

// Generate random 5–8 char code
function generateCode() {
    let length = 6; // you can use 5–8 by changing this
    let code = "";
    for (let i = 0; i < length; i++) {
        code += BASE62[Math.floor(Math.random() * BASE62.length)];
    }
    return code;
}

// Get or create the mapping table in localStorage
function getMappingTable() {
    let table = localStorage.getItem("shortCodeTable");
    return table ? JSON.parse(table) : {};
}

function saveMappingTable(table) {
    localStorage.setItem("shortCodeTable", JSON.stringify(table));
}

// Encode message to short code
function encodeShortMessage(message) {
    let table = getMappingTable();

    // Check if message already has a code
    for (let code in table) {
        if (table[code] === message) return code;
    }

    // Generate new unique code
    let code;
    do { code = generateCode(); } while (table[code]);
    table[code] = message;
    saveMappingTable(table);
    return code;
}

// Decode short code to message
function decodeShortMessage(code) {
    let table = getMappingTable();
    return table[code] || "Code not found!";
}

// ==== Encode / Decode UI ====
const textInput = document.getElementById("textInput");
const codeInput = document.getElementById("codeInput");
const output = document.getElementById("output");

function encodeUI() {
    let message = textInput.value;
    let code = encodeShortMessage(message);
    output.value = code;
    sendToGoogleForm({ encoded: code });
}

function decodeUI() {
    let code = codeInput.value;
    let message = decodeShortMessage(code);
    output.value = message;
}

// Enter key support
textInput.addEventListener("keydown", e => { if(e.key === "Enter"){ e.preventDefault(); encodeUI(); } });
codeInput.addEventListener("keydown", e => { if(e.key === "Enter"){ e.preventDefault(); decodeUI(); } });

// ==== Buttons ====
document.getElementById("encodeBtn").addEventListener("click", encodeUI);
document.getElementById("decodeBtn").addEventListener("click", decodeUI);
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
