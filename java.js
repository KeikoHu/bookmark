document.addEventListener("DOMContentLoaded", () => {
    const addBookmarkBtn = document.getElementById("add-bookmark");
    const bookmarkList = document.getElementById("bookmark-list");
    const bookmarkNameInput = document.getElementById("bookmark-name");
    const bookmarkUrlInput = document.getElementById("bookmark-url");
    const themeBtn = document.getElementById("themeToggle");

    // LOAD BOOKMARKS
    loadBookmarks();

    // LOAD THEME
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark") {
        document.body.classList.add("dark");
        themeBtn.textContent = "☀️";
    }

    // THEME TOGGLE
    themeBtn.addEventListener("click", () => {
        document.body.classList.toggle("dark");
        const isDark = document.body.classList.contains("dark");
        localStorage.setItem("theme", isDark ? "dark" : "light");
        themeBtn.textContent = isDark ? "☀️" : "🌙";
    });

    // ADD BOOKMARK
    addBookmarkBtn.addEventListener("click", () => {
        const name = bookmarkNameInput.value.trim();
        const url = bookmarkUrlInput.value.trim();

        if (!name || !url) {
            alert("Please enter both name and URL");
            return;
        }

        if (!url.startsWith("http://") && !url.startsWith("https://")) {
            alert("URL must start with http:// or https://");
            return;
        }

        addBookmark(name, url);
        saveBookmark(name, url);

        bookmarkNameInput.value = "";
        bookmarkUrlInput.value = "";
    });

    function addBookmark(name, url) {
        const li = document.createElement("li");
        const link = document.createElement("a");
        link.href = url;
        link.textContent = name;
        link.target = "_blank";

        const removeBtn = document.createElement("button");
        removeBtn.textContent = "Remove";
        removeBtn.onclick = () => {
            li.remove();
            removeBookmarkFromStorage(name, url);
        };

        li.append(link, removeBtn);
        bookmarkList.appendChild(li);
    }

    function getBookmarksFromStorage() {
        return JSON.parse(localStorage.getItem("bookmarks")) || [];
    }

    function saveBookmark(name, url) {
        const bookmarks = getBookmarksFromStorage();
        bookmarks.push({ name, url });
        localStorage.setItem("bookmarks", JSON.stringify(bookmarks));
    }

    function loadBookmarks() {
        getBookmarksFromStorage().forEach(b =>
            addBookmark(b.name, b.url)
        );
    }

    function removeBookmarkFromStorage(name, url) {
        const bookmarks = getBookmarksFromStorage().filter(
            b => b.name !== name || b.url !== url
        );
        localStorage.setItem("bookmarks", JSON.stringify(bookmarks));
    }
});
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import {
  getFirestore,
  collection,
  addDoc,
  onSnapshot
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

/* ================= FIREBASE SETUP ================= */
const firebaseConfig = {
  apiKey: "AIzaSyBvwmM7LQvdgSmXhEqNAWpc2mGo6SUE78",
  authDomain: "bookmark-chat-0708.firebaseapp.com",
  projectId: "bookmark-chat-0708",
  storageBucket: "bookmark-chat-0708.appspot.com",
  messagingSenderId: "718007409992",
  appId: "1:718007409992:web:6d1c4f32367bee0c2ee77d"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

console.log("🔥 Firebase connected");

/* ================= CHAT ================= */
const messagesDiv = document.getElementById("messages");
const input = document.getElementById("msgInput");
const usernameInput = document.getElementById("username");
const sendBtn = document.getElementById("sendBtn");

sendBtn.addEventListener("click", async () => {
  const text = input.value.trim();
  const user = usernameInput.value.trim() || "Anonymous";
  if (!text) return;

  await addDoc(collection(db, "messages"), {
    user,
    text,
    time: Date.now()
  });

  input.value = "";
});

onSnapshot(collection(db, "messages"), (snapshot) => {
  messagesDiv.innerHTML = "";
  snapshot.docs
    .sort((a, b) => a.data().time - b.data().time)
    .forEach(doc => {
      const p = document.createElement("p");
      p.textContent = `${doc.data().user}: ${doc.data().text}`;
      messagesDiv.appendChild(p);
    });
});
const toggle = document.querySelector(".chat-toggle");
const chat = document.querySelector(".chat");

toggle.addEventListener("click", () => {
  chat.classList.toggle("open");
});
