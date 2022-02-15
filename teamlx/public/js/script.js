document.addEventListener(
  "DOMContentLoaded",
  () => {
    console.log("teamlx JS imported successfully!");

    const editor = new EditorJS({
      
      minHeight: 50,
      holder: "editor",
      tools: {
        header: {
          class: Header,
          inlineToolbar: ["link"],
        },
        list: {
          class: List,
          inlineToolbar: true,
        },
      },
    });

    document
      .getElementById("editorSend")
      .addEventListener("click", function () {
        editor.save().then(function (data) {
          console.log(data);

          fetch('/posts/create', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },

            
            body: JSON.stringify(data)
          })
        });
        
      });
  },
  false
);
