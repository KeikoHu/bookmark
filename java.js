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
