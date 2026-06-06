const STORAGE_KEY = "hexamerousCodeVersion2";

let currentName = "";
let currentKana = "";
let selected = [];
let editingShape = null;
let paintColor = "white";

let savedCodes =
  JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");

const choices = document.getElementById("choices");
const result = document.getElementById("result");
const savedList = document.getElementById("savedList");
const statusText = document.getElementById("status");
const editArea = document.getElementById("editArea");
const backupText = document.getElementById("backupText");

const validColors = [
  "white",
  "black",
  "red",
  "green",
  "blue",
  "yellow",
  "cyan",
  "purple",
  "pink"
];

savedCodes =
  savedCodes.filter(isValidSavedCode);

function isValidSavedCode(item) {

  return item &&
    typeof item.name === "string" &&
    typeof item.kana === "string" &&
    Array.isArray(item.code) &&
    item.code.length === 6 &&
    item.code.every(isValidShape);
}

function isValidShape(shape) {

  return shape &&
    typeof shape.type === "string" &&
    shape.type === "six" &&
    Array.isArray(shape.colors) &&
    shape.colors.length === 6 &&
    shape.colors.every(color =>
      validColors.includes(color)
    );
}

function saveLocal() {

  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(savedCodes)
  );
}

function startCode() {

  currentName =
    document.getElementById("codeName").value.trim();

  currentKana =
    document.getElementById("codeKana").value.trim();

  if (!currentName || !currentKana) {

    alert("コード名とよみを入力してください");
    return;
  }

  selected = [];
  editingShape = null;

  result.innerHTML = "";
  editArea.innerHTML = "";

  statusText.textContent =
    `「${currentName}」：6個の円を作ってください。`;
}

function clearSelectedColorButtons() {

  document
    .querySelectorAll(".colorButton")
    .forEach(button => {
      button.classList.remove("selectedColor");
    });
}

function selectPaintColor(color) {

  paintColor = color;

  clearSelectedColorButtons();

  if (color === "white") {
    document
      .getElementById("whiteButton")
      .classList.add("selectedColor");
  }

  if (color === "black") {
    document
      .getElementById("blackButton")
      .classList.add("selectedColor");
  }

  if (color === "red") {
    document
      .getElementById("redButton")
      .classList.add("selectedColor");
  }

  if (color === "green") {
    document
      .getElementById("greenButton")
      .classList.add("selectedColor");
  }

  if (color === "blue") {
    document
      .getElementById("blueButton")
      .classList.add("selectedColor");
  }

  if (color === "yellow") {
    document
      .getElementById("yellowButton")
      .classList.add("selectedColor");
  }

  if (color === "cyan") {
    document
      .getElementById("cyanButton")
      .classList.add("selectedColor");
  }

  if (color === "purple") {
    document
      .getElementById("purpleButton")
      .classList.add("selectedColor");
  }

  if (color === "pink") {
    document
      .getElementById("pinkButton")
      .classList.add("selectedColor");
  }
}

function startEditingShape() {

  if (!currentName || !currentKana) {

    alert("先に開始してください");
    return;
  }

  if (selected.length >= 6) {

    alert("6個すべて完成しています。保存してください。");
    return;
  }

  editingShape = {
    type: "six",
    colors: ["", "", "", "", "", ""]
  };

  renderEditingShape();
}

function clearEditingShape() {

  if (!editingShape) {

    alert("先に円を選んでください");
    return;
  }

  editingShape.colors =
    ["", "", "", "", "", ""];

  renderEditingShape();
}

function paintArea(index) {

  if (!editingShape) return;

  editingShape.colors[index] = paintColor;

  renderEditingShape();
}

function addPaintedShape() {

  if (!currentName || !currentKana) {

    alert("先に開始してください");
    return;
  }

  if (!editingShape) {

    alert("先に円を選んでください");
    return;
  }

  if (
    editingShape.colors.some(color => !color)
  ) {

    alert("すべての面を塗ってください");
    return;
  }

  if (selected.length >= 6) {

    alert("6個すべて完成しています。保存してください。");
    return;
  }

  selected.push(
    JSON.parse(JSON.stringify(editingShape))
  );

  result.appendChild(
    makeSmallShape(editingShape)
  );

  editingShape = null;
  editArea.innerHTML = "";

  if (selected.length === 6) {

    statusText.textContent =
      `「${currentName}」は完成です。保存してください。`;

  } else {

    statusText.textContent =
      `「${currentName}」：あと${6 - selected.length}個作ってください。`;
  }
}

function saveCode() {

  if (!currentName || !currentKana) {

    alert("先に開始してください");
    return;
  }

  if (selected.length !== 6) {

    alert("6個完成させてください");
    return;
  }

  savedCodes.push({
    name: currentName,
    kana: currentKana,
    code: JSON.parse(JSON.stringify(selected))
  });

  savedCodes.sort((a, b) =>
    a.kana.localeCompare(b.kana, "ja")
  );

  saveLocal();

  renderSaved();

  resetCurrent();

  document.getElementById("codeName").value = "";
  document.getElementById("codeKana").value = "";
}

function resetCurrent() {

  currentName = "";
  currentKana = "";
  selected = [];
  editingShape = null;

  result.innerHTML = "";
  editArea.innerHTML = "";

  statusText.textContent =
    "コード名・よみを決めて開始してください。円は必ず6個です。";
}

function renderSaved() {

  savedList.innerHTML = "";

  savedCodes =
    savedCodes.filter(isValidSavedCode);

  saveLocal();

  savedCodes.forEach((item, index) => {

    const card =
      document.createElement("div");

    card.className = "card";

    const title =
      document.createElement("h3");

    const checkbox =
      document.createElement("input");

    checkbox.type = "checkbox";
    checkbox.className = "selectBox";
    checkbox.dataset.index = index;

    const label =
      document.createElement("span");

    label.textContent =
      `${item.name}（${item.kana}）`;

    title.appendChild(checkbox);
    title.appendChild(label);

    card.appendChild(title);

    card.appendChild(
      makeHexagonSvg(item.code)
    );

    savedList.appendChild(card);
  });
}

function makeHexagonSvg(code) {

  const svg =
    document.createElementNS(
      "http://www.w3.org/2000/svg",
      "svg"
    );

  svg.setAttribute("viewBox", "0 0 460 440");

  svg.classList.add("savedHexagonSvg");

  const positions = [

    { x: 230, y: 55 },

    { x: 358, y: 130 },

    { x: 358, y: 285 },

    { x: 230, y: 360 },

    { x: 102, y: 285 },

    { x: 102, y: 130 }

  ];

  for (let i = 0; i < 6; i++) {

    const g =
      document.createElementNS(
        "http://www.w3.org/2000/svg",
        "g"
      );

    g.setAttribute(
      "transform",
      `translate(${positions[i].x - 60}, ${positions[i].y - 65})`
    );

    g.innerHTML =
      getShapeSvgInner(code[i], false);

    svg.appendChild(g);
  }

  return svg;
}

function getCheckedIndexes() {

  const checked =
    document.querySelectorAll(".selectBox:checked");

  return Array.from(checked).map(box =>
    Number(box.dataset.index)
  );
}

function deleteSelectedCodes() {

  const indexes = getCheckedIndexes();

  if (indexes.length === 0) {

    alert("削除するコードを選択してください");
    return;
  }

  if (
    !confirm(`${indexes.length}件削除しますか？`)
  ) return;

  savedCodes =
    savedCodes.filter((item, index) =>
      !indexes.includes(index)
    );

  saveLocal();

  renderSaved();
}

function printAllCodes() {

  if (savedCodes.length === 0) {

    alert("印刷するコードがありません");
    return;
  }

  document.body.classList.remove("print-selected");

  document.querySelectorAll(".card").forEach(card => {
    card.classList.remove("printTarget");
  });

  window.print();
}

function printSelectedCodes() {

  const checked =
    document.querySelectorAll(".selectBox:checked");

  if (checked.length === 0) {

    alert("印刷するコードを選択してください");
    return;
  }

  document.body.classList.add("print-selected");

  document.querySelectorAll(".card").forEach(card => {
    card.classList.remove("printTarget");
  });

  checked.forEach(box => {

    const card = box.closest(".card");

    if (card) {
      card.classList.add("printTarget");
    }
  });

  window.print();
}

window.onafterprint = function() {

  document.body.classList.remove("print-selected");

  document.querySelectorAll(".card").forEach(card => {
    card.classList.remove("printTarget");
  });
};

function makeBackupText() {

  const data = {
    appName: "Hexamerous Code",
    version: 2,
    type: "nineColors",
    savedCodes: savedCodes
  };

  backupText.value =
    JSON.stringify(data, null, 2);

  backupText.focus();
  backupText.select();

  alert("バックアップ文字を作りました");
}

function copyBackupText() {

  if (!backupText.value.trim()) {

    makeBackupText();
  }

  backupText.focus();
  backupText.select();

  try {

    document.execCommand("copy");

    alert("コピーしました");

  } catch (e) {

    alert("手動コピーしてください");
  }
}

function restoreFromBackupText() {

  const text = backupText.value.trim();

  if (!text) {

    alert("バックアップ文字を貼り付けてください");
    return;
  }

  try {

    const data = JSON.parse(text);

    let importedCodes = [];

    if (Array.isArray(data)) {

      importedCodes = data;

    } else if (
      data.savedCodes &&
      Array.isArray(data.savedCodes)
    ) {

      importedCodes = data.savedCodes;

    } else {

      alert("正しいバックアップではありません");
      return;
    }

    importedCodes.forEach(item => {

      if (isValidSavedCode(item)) {

        savedCodes.push({
          name: item.name,
          kana: item.kana,
          code: JSON.parse(JSON.stringify(item.code))
        });
      }
    });

    savedCodes.sort((a, b) =>
      a.kana.localeCompare(b.kana, "ja")
    );

    saveLocal();

    renderSaved();

    alert("バックアップを読み込みました");

  } catch (e) {

    alert("読み込みできませんでした");
  }
}

function colorValue(color) {

  return color || "white";
}

function makeChoiceShape() {

  const shape = {
    type: "six",
    colors: ["", "", "", "", "", ""]
  };

  const svg =
    document.createElementNS(
      "http://www.w3.org/2000/svg",
      "svg"
    );

  svg.setAttribute("viewBox", "0 0 120 130");

  svg.classList.add("shape");

  svg.innerHTML =
    getShapeSvgInner(shape, false);

  svg.onclick = function() {
    startEditingShape();
  };

  return svg;
}

function makeSmallShape(shape) {

  const svg =
    document.createElementNS(
      "http://www.w3.org/2000/svg",
      "svg"
    );

  svg.setAttribute("viewBox", "0 0 120 130");

  svg.classList.add("shape");

  svg.innerHTML =
    getShapeSvgInner(shape, false);

  return svg;
}

function renderEditingShape() {

  editArea.innerHTML = "";

  if (!editingShape) return;

  const svg =
    document.createElementNS(
      "http://www.w3.org/2000/svg",
      "svg"
    );

  svg.setAttribute("viewBox", "0 0 120 130");

  svg.classList.add("editShape");

  svg.innerHTML =
    getShapeSvgInner(editingShape, true);

  editArea.appendChild(svg);
}

function makePaintable(index, editable) {

  if (!editable) return "";

  return `
    onclick="event.stopPropagation(); paintArea(${index});"
    style="cursor:pointer;"
  `;
}

function getShapeSvgInner(shape, editable) {

  return `

    <path
      d="M60 65 L60 23 A42 42 0 0 1 96.37 44 Z"
      fill="${colorValue(shape.colors[0])}"
      stroke="black"
      stroke-width="4"
      ${makePaintable(0, editable)}
    />

    <path
      d="M60 65 L96.37 44 A42 42 0 0 1 96.37 86 Z"
      fill="${colorValue(shape.colors[1])}"
      stroke="black"
      stroke-width="4"
      ${makePaintable(1, editable)}
    />

    <path
      d="M60 65 L96.37 86 A42 42 0 0 1 60 107 Z"
      fill="${colorValue(shape.colors[2])}"
      stroke="black"
      stroke-width="4"
      ${makePaintable(2, editable)}
    />

    <path
      d="M60 65 L60 107 A42 42 0 0 1 23.63 86 Z"
      fill="${colorValue(shape.colors[3])}"
      stroke="black"
      stroke-width="4"
      ${makePaintable(3, editable)}
    />

    <path
      d="M60 65 L23.63 86 A42 42 0 0 1 23.63 44 Z"
      fill="${colorValue(shape.colors[4])}"
      stroke="black"
      stroke-width="4"
      ${makePaintable(4, editable)}
    />

    <path
      d="M60 65 L23.63 44 A42 42 0 0 1 60 23 Z"
      fill="${colorValue(shape.colors[5])}"
      stroke="black"
      stroke-width="4"
      ${makePaintable(5, editable)}
    />

    <circle
      cx="60"
      cy="65"
      r="42"
      fill="none"
      stroke="black"
      stroke-width="4"
      pointer-events="none"
    />
  `;
}

function makeAllChoices() {

  choices.innerHTML = "";

  choices.appendChild(
    makeChoiceShape()
  );
}

makeAllChoices();

renderSaved();
