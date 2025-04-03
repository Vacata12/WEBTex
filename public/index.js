const uploadfile = (file) => {
    const formData = new FormData()
    formData.append("uploadFile", file) // Attach the file to the request

    fetch("http://localhost:3000/api/uploadfile", {
        method: "POST",
        body: formData, // Send the FormData object
    })
    .then((response) => response.text()) // Handle the server response
    .then((data) => console.log(data)) // Log the response
    .catch((error) => console.error("Error:", error)) // Handle errors
}