// @ts-check
/// <reference types="./env" />

const colors = {
  docs: "#fff",
  slides: "#000",
  sheets: "#fff",
};

const backgrounds = {
  docs: "#1a73e8",
  slides: "#fbbc04",
  sheets: "#188038",
};

const hoverBackgrounds = {
  docs: "#2b7de9",
  slides: "#fbc117",
  sheets: "#2a8947",
};

const shadows = {
  docs: "0 1px 3px 1px rgb(66 133 244 / 15%)",
  slides: "0 1px 3px 1px rgb(251 188 4 / 15%)",
  sheets: "0 1px 3px 1px rgb(52 168 83 / 15%)",
};

if (location.pathname.endsWith("/edit")) {
  setupInstantShare();
}

function pickStyle(/** @type {DocsStyleSheet} */ obj) {
  if (location.href.includes("presentation")) {
    return obj.slides;
  } else if (location.href.includes("spreadsheet")) {
    return obj.sheets;
  } else {
    return obj.docs;
  }
}

function setupInstantShare() {
  const buttons = document.getElementsByClassName("docs-titlebar-buttons")[0];

  if (!buttons || !(buttons instanceof HTMLElement)) {
    setTimeout(setupInstantShare, 1000);
    return;
  }

  if (window.hasShareWithStudents) {
    return;
  }

  window.hasShareWithStudents = true;

  const span = document.createElement("span");
  span.setAttribute("displayname", "null");
  span.className = "scb-container";

  const div = document.createElement("div");
  div.setAttribute("role", "button");
  div.className =
    "goog-inline-block jfk-button jfk-button-action docs-titlebar-button";
  div.ariaDisabled = "false";
  div.ariaLabel =
    "Create a link that, when opened, will copy the document and share it with you.";
  div.tabIndex = 0;
  div.setAttribute(
    "style",
    `
  user-select: none;
  background-image: none;
  border: 1px solid transparent !important;
  border-radius: 4px;
  box-shadow: none;
  box-sizing: border-box;
  font-family: "Google Sans", Roboto, RobotoDraft, Helvetica, Arial, sans-serif;
  font-weight: 500;
  font-size: 14px;
  height: 36px;
  letter-spacing: 0.25px;
  line-height: 16px;
  padding: 9px 24px 11px 24px;
  background: ${pickStyle(backgrounds)};
  color: ${pickStyle(colors)};
  padding: 9px 16px 10px 12px;
  text-transform: capitalize;
  cursor: pointer;`
  );
  div.onmouseover = () => {
    div.style.background = pickStyle(hoverBackgrounds);
    div.style.boxShadow = pickStyle(shadows);
    div.classList.add("jfk-button-hover");
  };
  div.onmouseout = () => {
    div.style.background = pickStyle(backgrounds);
    div.style.boxShadow = "";
    div.classList.remove("jfk-button-hover");
  };

  div.onclick = () => {
    const account = document.querySelector("[aria-label^='Google Account: ']");

    let email, name, title;
    if (account && account.ariaLabel) {
      name = account.ariaLabel?.match(/:\s+([^)]+)\s+\(/)?.[1].trim();
      email = account.ariaLabel?.match(/\(([^)]+@[^)]+)\)/)?.[1].trim();
    }

    title = document.title.split(" - ").slice(0, -1).join(" - ");

    makeModal(name, email, title);
  };

  const icon = document.createElement("span");
  icon.className =
    "scb-icon apps-share-sprite scb-button-icon scb-unlisted-icon-white";
  icon.innerHTML = "&nbsp;";

  const label = document.createTextNode("Share with Students");

  div.append(icon, label);
  span.append(div);
  buttons.prepend(span);
}

function createField(
  /** @type {string} */ desc,
  /** @type {string | undefined} */ initialValue,
  /** @type {(value: string) => void} */ onUpdate
) {
  const id = `share-with-students-${Math.random().toString().slice(2)}`;

  const label = document.createElement("label");
  label.htmlFor = id;
  label.textContent = desc;

  const br = document.createElement("br");

  const div = document.createElement("div");
  div.style.overflow = "auto";

  const field = document.createElement("input");
  field.className = "modal-dialog-userInput jfk-textinput";
  field.type = "text";
  field.id = id;
  field.dir = "ltr";
  field.value = initialValue || "";
  field.oninput = () => onUpdate(field.value);

  const frag = document.createDocumentFragment();

  div.append(field);
  frag.append(label, br, div);

  return frag;
}

function makeModal(
  /** @type {string | undefined} */ name,
  /** @type {string | undefined} */ email,
  /** @type {string} */ titleText
) {
  const outer = document.createElement("div");
  outer.setAttribute(
    "style",
    `
  background: rgb(0, 0, 0, 0.502);
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 50000;
  `
  );

  outer.onclick = () => closeThis();

  const div = document.createElement("div");
  div.className = "modal-dialog docs-rename-dialog docs-dialog";
  div.tabIndex = 0;
  div.setAttribute("role", "dialog");
  div.style.minHeight = "min(300px, 100vh)";
  div.style.minWidth = "min(500px, 100vw)";

  div.onclick = (event) => event.stopPropagation();

  const title = document.createElement("div");
  title.className = "modal-dialog-title modal-dialog-title-draggable";

  const titleSpan = document.createElement("span");
  titleSpan.className = "modal-dialog-title-text";
  titleSpan.setAttribute("role", "heading");
  titleSpan.textContent = "Share with Students";

  const close = document.createElement("span");
  close.className = "modal-dialog-title-close";
  close.setAttribute("role", "button");
  close.tabIndex = 0;
  close.ariaLabel = "Close";

  close.onclick = () => closeThis();

  const content = document.createElement("div");
  content.className = "modal-dialog-content";

  const fieldA = createField("Enter your name:", name, (_name) => {
    name = _name;
    update();
  });

  const fieldB = createField("Enter your email address:", email, (_email) => {
    email = _email;
    update();
  });

  const br = document.createElement("br");

  const msg = document.createElement("div");
  msg.style.fontSize = "0.85rem";

  const msg2 = document.createElement("div");
  msg2.textContent = "Make sure to give students access to the document!";
  msg2.style.fontSize = "0.85rem";
  msg2.style.fontWeight = "bold";

  const body = document.createElement("div");
  body.style.fontSize = "1rem";
  body.style.marginInline = "1rem";
  body.style.marginBlockStart = "1rem";
  body.style.marginBlockEnd = "1.5rem";
  body.style.userSelect = "all";

  const text1 = document.createTextNode("Click the link to copy ");

  const link = document.createElement("a");
  link.target = "_blank";
  link.textContent = titleText;

  const text2 = document.createTextNode(" and share it with your teacher.");

  function update() {
    const shareUrl = new URL(`./copy?userstoinvite=${email}`, location.href);
    link.href = shareUrl.href;

    if (name) {
      text2.data = ` and share it with ${name}.`;
      msg.textContent = `${name}, copy the text below and paste it into your assignment system.`;
    } else {
      text2.data = ` and share it with your teacher.`;
      msg.textContent = `Copy the text below and paste it into your assignment system.`;
    }
  }

  update();

  const buttons = document.createElement("div");

  const ok = document.createElement("button");
  ok.name = "ok";
  ok.className = "goog-buttonset-default goog-buttonset-action";
  ok.textContent = "OK";

  ok.onclick = () => closeThis();

  title.append(titleSpan, close);
  body.append(text1, link, text2);
  content.append(fieldA, fieldB, br, msg, msg2, body);
  buttons.append(ok);
  div.append(title, content, buttons);
  outer.append(div);
  document.body.append(outer);

  function closeThis() {
    outer.remove();
  }
}
