const uploadFile = (file: File): void => {
    const formData = new FormData();
    formData.append("uploadFile", file);
  
    fetch("http://localhost:3000/api/files/upload", {
      method: "POST",
      body: formData,
    })
      .then((response) => response.text())
      .then((data) => console.log(data))
      .catch((error) => console.error("Error:", error));
  };
  
  const downloadFile = (filename: string): void => {
    fetch(`http://localhost:3000/api/files/download/${filename}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("File not found");
        }
        return response.blob();
      })
      .then((blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        a.remove();
      })
      .catch((error) => console.error("Error:", error));
  };