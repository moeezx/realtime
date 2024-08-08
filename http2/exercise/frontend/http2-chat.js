const chat = document.getElementById("chat");
const msgs = document.getElementById("msgs");
const presence = document.getElementById("presence-indicator");

// this will hold all the most recent messages
let allChat = [];

chat.addEventListener("submit", function (e) {
  e.preventDefault();
  postNewMsg(chat.elements.user.value, chat.elements.text.value);
  chat.elements.text.value = "";
});

async function postNewMsg(user, text) {
  const data = {
    user,
    text,
  };

  // request options
  const options = {
    method: "POST",
    body: JSON.stringify(data),
    headers: {
      "Content-Type": "application/json",
    },
  };

  // send POST request
  // we're not sending any json back, but we could
  await fetch("/msgs", options);
  // remove the extra closing brace

async function getNewMsgs() {
  let reader;
  const utf8Decoder = new TextDecoder("utf-8");
  try {
    const res = await fetch("/msgs"); 
    reader = res.body.getReader(); //stream of data coming, not just 1
    // we dont use res.json cuz that waits for the entire thing to come, its not for streams
  } catch (e) {
    console.log("connection error", e)
  }
  presence.innerText = "🟢"



  do {
    let readerResponse;
    let done
    try {
      readerResponse = await reader.read();
  
      console.log(chunk)
    } catch (e) {
      console.error("reader fail", e)
      presence.innerText = "🔴"
      return;
    }


    const chunk = utf8Decoder.decode(readerResponse.value, { stream: true})
    done = readerResponse.done;

    if (chunk) {
      try{
        const json = JSON.parse(chunk);
        allChat = json.msg;
        render();
      } catch (e) {
        console.error("parse error", e)
      }   
     }
  } while (!done)
  } 
  }

function render() {
  const html = allChat.map(({ user, text, time, id }) =>
    template(user, text, time, id)
  );
  msgs.innerHTML = html.join("\n");
}

const template = (user, msg) =>
  `<li class="collection-item"><span class="badge">${user}</span>${msg}</li>`;

getNewMsgs();
