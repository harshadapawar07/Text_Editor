const preview = document.getElementById("preview");

function applyCommand(command) {
  document.execCommand(command, false, null);
  updateToolbarState();
}

function updateToolbarState() {
  const commands = ['bold', 'italic', 'underline', 'strikethrough', 
                    'justifyLeft', 'justifyCenter', 'justifyRight', 
                    'justifyFull', 'insertUnorderedList', 'insertOrderedList'];
  commands.forEach(command => {
    const button = document.getElementById(`${command}Button`);
    if (document.queryCommandState(command)) {
      button.classList.add("active");
    } else {
      button.classList.remove("active");
    }
  });
}

preview.addEventListener("mouseup", updateToolbarState);
preview.addEventListener("keyup", updateToolbarState);

function uploadImage(event) {
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = function (e) {
      const imgContainer = document.createElement("div");
      imgContainer.className = "resizable";
      imgContainer.contentEditable = false;

      const img = document.createElement("img");
      img.src = e.target.result;
      img.style.maxWidth = "100%";
      img.style.width = "300px"; // Default width
      img.style.height = "auto"; // Default height

      imgContainer.appendChild(img);
      preview.appendChild(imgContainer);

      imgContainer.addEventListener("mousedown", startResizing);
    };
    reader.readAsDataURL(file);
  }
}

let resizingElement = null;
let startX, startY, startWidth, startHeight;

function startResizing(e) {
  const target = e.target.closest(".resizable img");
  if (target) {
    resizingElement = target;
    startX = e.clientX;
    startY = e.clientY;
    startWidth = parseInt(getComputedStyle(target, null).getPropertyValue("width"), 10);
    startHeight = parseInt(getComputedStyle(target, null).getPropertyValue("height"), 10);
    document.addEventListener("mousemove", resizeElement);
    document.addEventListener("mouseup", stopResizing);
  }
}

function resizeElement(e) {
  if (resizingElement) {
    const newWidth = startWidth + (e.clientX - startX);
    const newHeight = startHeight + (e.clientY - startY);
    resizingElement.style.width = `${newWidth}px`;
    resizingElement.style.height = `${newHeight}px`;
  }
}

function stopResizing() {
  resizingElement = null;
  document.removeEventListener("mousemove", resizeElement);
  document.removeEventListener("mouseup", stopResizing);
}

function changeFontSize(event) {
  document.execCommand("fontSize", false, event.target.value);
}

function saveContent() {
  const text = preview.innerHTML;
  const blob = new Blob([text], { type: "text/html" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = "editor_content.html";
  link.click();
}
