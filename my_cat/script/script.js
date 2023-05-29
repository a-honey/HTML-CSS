const navBtn = document.getElementById("menu-icon");
const nav = document.getElementById("nav");
const navlist = {
  profile: document.getElementById("profile"),
  personality: document.getElementById("personality"),
  likes: document.getElementById("likes"),
  skills: document.getElementById("skills"),
  photos: document.getElementById("photos"),
};

function createContent(name, navlist) {
  return function () {
    Object.values(navlist).forEach((el) => {
      el.classList.remove("clicked");
    });
    name.classList.toggle("clicked");
    if ([...name.classList].find((className) => className === "clicked")) {
      document.getElementById("content").innerHTML = "";
      if (name.id === "photos") {
        const h1 = document.createElement("h1");
        h1.innerHTML = name.id;
        h1.className = name.id;
        document.getElementById("content").appendChild(h1);
        const div = document.createElement("div");
        div.classList.add("cat-wrapper");
        for (let i = 2; i <= 10; i++) {
          div.innerHTML += `<img class="cat" src="../images/${i}.jpg" alt="고양이사진">`;
        }
        document.getElementById("content").appendChild(div);
        const catImg = document.querySelectorAll(".cat");
        catImg.forEach((el) => {
          el.addEventListener("click", () => {
            el.classList.remove("cat");
            el.classList.add("only");
            const tempCat = [...catImg].filter((cat) => cat != el);
            tempCat.forEach((el) => {
              el.classList.remove("cat");
              el.classList.add("unclicked");
            });
            el.addEventListener("dblclick", () => {
              catImg.forEach((el) => {
                el.classList.remove("only");
                el.classList.remove("unclicked");
                el.classList.add("cat");
              });
            });
          });
        });
      } else {
        const xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function () {
          if (xhr.readyState === 4 && xhr.status === 200) {
            const content = xhr.responseText;
            const tempDiv = document.createElement("div");
            tempDiv.innerHTML = content;

            const scripts = tempDiv.getElementsByTagName("script");
            for (let i = scripts.length - 1; i >= 0; i--) {
              scripts[i].parentNode.removeChild(scripts[i]);
            }

            const cleanedContent = tempDiv.innerHTML;
            const div = document.createElement("div");
            div.innerHTML = cleanedContent;
            document.getElementById("content").appendChild(div);
          }
        };
        xhr.open("GET", `../contents/${name.id}.html`);
        xhr.send();
      }
    } else {
      document.getElementById("content").innerHTML = "";
    }
  };
}

navBtn.addEventListener("click", () => {
  nav.classList.toggle("clicked");
});

Object.values(navlist).forEach((element) => {
  element.addEventListener("click", createContent(element, navlist));
});
