const $ = (selector, root = document) => root.querySelector(selector);
const editor = $("#editor");
const titles = { general: "Genel", skills: "Beceriler", experience: "Deneyim", projects: "Projeler", messages: "Mesajlar" };
let content;
let currentView = "general";
let dirty = false;

async function api(path, options = {}) {
  const response = await fetch(path, { ...options, headers: { ...(options.body ? { "content-type": "application/json" } : {}), ...options.headers } });
  const payload = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(payload.error || "İstek tamamlanamadı.");
  return payload;
}

function node(tag, attrs = {}, children = []) {
  const element = document.createElement(tag);
  for (const [key, value] of Object.entries(attrs)) {
    if (key === "class") element.className = value;
    else if (key === "text") element.textContent = value;
    else if (key.startsWith("on")) element.addEventListener(key.slice(2), value);
    else if (key === "checked") element.checked = value;
    else element.setAttribute(key, value);
  }
  for (const child of [].concat(children)) if (child) element.append(child);
  return element;
}

function inputField(label, value, onInput, options = {}) {
  const control = options.textarea ? node("textarea") : node("input", { type: options.type || "text" });
  control.value = value ?? "";
  if (options.placeholder) control.placeholder = options.placeholder;
  control.addEventListener("input", () => { onInput(options.type === "checkbox" ? control.checked : control.value); markDirty(); });
  return node("label", { class: options.wide ? "wide" : "" }, [label, control]);
}

function markDirty() { dirty = true; $("#save-state").textContent = "Kaydedilmemiş değişiklikler"; }
function toast(message) { const el = $("#toast"); el.textContent = message; el.hidden = false; clearTimeout(toast.timer); toast.timer = setTimeout(() => { el.hidden = true; }, 3000); }
function csv(value) { return value.split(",").map((item) => item.trim()).filter(Boolean); }
function lines(value) { return value.split("\n").map((item) => item.trim()).filter(Boolean); }

function sectionHeading(title, addLabel, onAdd) {
  return node("div", { class: "section-heading" }, [node("h2", { text: title }), addLabel && node("button", { type: "button", text: addLabel, onclick: onAdd })]);
}

function generalView() {
  const fields = node("div", { class: "field-grid" });
  const definitions = [
    ["Ad soyad", "profile", "name"], ["Rol / unvan", "profile", "role"], ["Tanıtım", "profile", "intro", true], ["E-posta", "profile", "email"],
    ["Site adresi", "profile", "site"], ["Özgeçmiş adresi", "profile", "resumeUrl"], ["GitHub kullanıcı adı", "profile", "githubUsername"], ["GitHub deposu", "profile", "githubRepo"],
    ["GitHub", "social", "github"], ["LinkedIn", "social", "linkedin"], ["X / Twitter", "social", "twitter"], ["Instagram", "social", "instagram"],
  ];
  fields.append(sectionHeading("Profil ve bağlantılar"));
  for (const [label, group, key, wide] of definitions) fields.append(inputField(label, content[group][key], (value) => content[group][key] = value, { wide, textarea: wide }));
  fields.append(sectionHeading("Bölüm metinleri"));
  const sectionLabels = { skillsTitle:"Beceriler başlığı", skillsDescription:"Beceriler açıklaması", experienceTitle:"Deneyim başlığı", experienceDescription:"Deneyim açıklaması", projectsTitle:"Projeler başlığı", contactTitle:"İletişim başlığı", contactDescription:"İletişim açıklaması" };
  for (const [key, label] of Object.entries(sectionLabels)) fields.append(inputField(label, content.sections[key], (value) => content.sections[key] = value, { wide: key === "contactDescription", textarea: key === "contactDescription" }));
  editor.replaceChildren(fields);
}

function collectionView(type) {
  const labels = { skills:["Beceriler", "Beceri ekle"], experience:["Deneyim", "Deneyim ekle"], projects:["Projeler", "Proje ekle"] };
  const root = node("div");
  root.append(sectionHeading(labels[type][0], labels[type][1], () => addItem(type)));
  const list = node("div", { class: "collection" });
  content[type].forEach((item, index) => list.append(itemEditor(type, item, index)));
  root.append(list);
  editor.replaceChildren(root);
}

function itemEditor(type, item, index) {
  const wrapper = node("article", { class: "item" });
  const title = item.label || item.title || item.id || `Kayıt ${index + 1}`;
  const move = (offset) => { const next = index + offset; if (next < 0 || next >= content[type].length) return; [content[type][index], content[type][next]] = [content[type][next], content[type][index]]; markDirty(); render(); };
  wrapper.append(node("div", { class: "item-header" }, [
    node("strong", { text: title }),
    node("button", { class:"icon", type:"button", title:"Yukarı taşı", text:"↑", onclick:() => move(-1) }),
    node("button", { class:"icon", type:"button", title:"Aşağı taşı", text:"↓", onclick:() => move(1) }),
    node("button", { class:"danger", type:"button", text:"Sil", onclick:() => { if (confirm("Bu kayıt silinsin mi?")) { content[type].splice(index, 1); markDirty(); render(); } } }),
  ]));
  const body = node("div", { class: "item-body" });
  const add = (label, key, options = {}) => body.append(inputField(label, Array.isArray(item[key]) ? item[key].join(options.lines ? "\n" : ", ") : item[key], (value) => item[key] = options.array ? (options.lines ? lines(value) : csv(value)) : value, options));
  if (type === "skills") { add("Kimlik", "id"); add("Ad", "label"); add("Kısa açıklama", "shortDescription", { wide:true }); add("Renk", "color"); add("İkon adresi", "icon"); add("3D ikon adresi", "keyboardIcon"); add("3D tuş rengi", "keyboardColor"); add("Klavye kısayolu", "shortcut"); }
  if (type === "experience") { add("Kimlik", "id"); add("Unvan", "title"); add("Kurum", "company"); add("Başlangıç", "startDate"); add("Bitiş", "endDate"); add("Açıklamalar (satır başına bir madde)", "description", { array:true, lines:true, textarea:true, wide:true }); add("Beceri kimlikleri (virgülle)", "skills", { array:true, wide:true }); }
  if (type === "projects") {
    add("Kimlik", "id"); add("Başlık", "title"); add("Kategori", "category"); add("Görsel adresi", "image"); add("Özet", "summary", { textarea:true, wide:true }); add("Açıklamalar (satır başına bir paragraf)", "description", { array:true, lines:true, textarea:true, wide:true }); add("Teknolojiler (virgülle)", "technologies", { array:true, wide:true }); add("GitHub adresi", "github"); add("Canlı site adresi", "live");
    const check = node("input", { type:"checkbox", checked:item.published }); check.addEventListener("change", () => { item.published = check.checked; markDirty(); }); body.append(node("label", { class:"checkbox wide" }, [check, "Yayında"]));
  }
  wrapper.append(body);
  return wrapper;
}

function addItem(type) {
  if (type === "skills") content.skills.push({ id:`beceri-${Date.now()}`, label:"Yeni beceri", shortDescription:"", color:"#ffffff", icon:"", keyboardIcon:"", keyboardColor:"#333537", shortcut:"" });
  if (type === "experience") content.experience.push({ id:`deneyim-${Date.now()}`, startDate:"", endDate:"", title:"Yeni deneyim", company:"", description:[], skills:[] });
  if (type === "projects") content.projects.push({ id:`proje-${Date.now()}`, category:"", title:"Yeni proje", image:"", summary:"", description:[], technologies:[], github:"", live:"", published:false });
  markDirty(); render();
}

async function messagesView() {
  editor.replaceChildren(node("p", { class:"muted", text:"Mesajlar yükleniyor..." }));
  try {
    const { messages } = await api("/api/admin/messages");
    const root = node("div"); root.append(sectionHeading(`Gelen mesajlar (${messages.length})`));
    if (!messages.length) root.append(node("p", { class:"muted", text:"Henüz mesaj yok." }));
    for (const message of messages) root.append(node("article", { class:"message" }, [node("div", { class:"message-head" }, [node("div", {}, [node("strong", { text:message.full_name }), node("div", { class:"muted", text:message.email })]), node("button", { class:"danger", text:"Sil", onclick:async() => { if (confirm("Mesaj silinsin mi?")) { await api(`/api/admin/messages/${message.id}`, { method:"DELETE" }); messagesView(); } } })]), node("small", { class:"muted", text:new Date(`${message.created_at}Z`).toLocaleString("tr-TR") }), node("p", { text:message.message })]));
    editor.replaceChildren(root);
  } catch (error) { editor.replaceChildren(node("p", { class:"error", text:error.message })); }
}

function render() {
  $("#view-title").textContent = titles[currentView];
  $("#save").hidden = currentView === "messages";
  if (currentView === "general") generalView();
  else if (currentView === "messages") messagesView();
  else collectionView(currentView);
}

async function showAdmin() {
  const payload = await api("/api/admin/content"); content = payload.content;
  $("#login-view").hidden = true; $("#admin-view").hidden = false; render();
}

$("#login-form").addEventListener("submit", async (event) => {
  event.preventDefault();
  const button = event.currentTarget.querySelector("button[type='submit']");
  $("#login-error").textContent = "";
  button.disabled = true;
  button.textContent = "Kontrol ediliyor...";
  event.currentTarget.setAttribute("aria-busy", "true");
  const data = new FormData(event.currentTarget);
  try { await api("/api/auth/login", { method:"POST", body:JSON.stringify({ username:data.get("username"), password:data.get("password") }) }); await showAdmin(); }
  catch (error) { $("#login-error").textContent = error.message; }
  finally {
    button.disabled = false;
    button.textContent = "Giriş yap";
    event.currentTarget.removeAttribute("aria-busy");
  }
});

$("#nav").addEventListener("click", (event) => { const button = event.target.closest("button[data-view]"); if (!button) return; currentView = button.dataset.view; document.querySelectorAll("#nav button").forEach((item) => item.classList.toggle("active", item === button)); render(); });
$("#save").addEventListener("click", async () => { const button = $("#save"); button.disabled = true; button.textContent = "Kaydediliyor..."; try { const payload = await api("/api/admin/content", { method:"PUT", body:JSON.stringify({ content }) }); content = payload.content; dirty = false; $("#save-state").textContent = "Tüm değişiklikler kaydedildi"; toast("İçerik yayınlandı."); } catch (error) { toast(error.message); } finally { button.disabled = false; button.textContent = "Değişiklikleri kaydet"; } });
$("#logout").addEventListener("click", async () => { await api("/api/auth/logout", { method:"POST" }); location.reload(); });
window.addEventListener("beforeunload", (event) => { if (dirty) event.preventDefault(); });

api("/api/admin/session").then(showAdmin).catch(() => {});
