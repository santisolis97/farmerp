function setCheckbox(view, id, value) {
  const elem = view.querySelector(id);
  elem.checked = value;
  if (value) {
    elem.setAttribute("checked", "");
  } else {
    elem.removeAttribute("checked");
  }

  if (view.id.startsWith("ver")) elem.value = value;
}
