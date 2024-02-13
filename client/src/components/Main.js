import axios from "axios";
import React, { useState } from "react";

const Main = () => {
    const [file, setFile] = useState(null);
    const [info, setInfo] = useState("");
    const [text, setText] = useState("");

    const handleFileChange = (event) => {
        setFile(event.target.files[0]);
    };

    const handleSubmit = async () => {
        if (!file) return;

        const formData = new FormData();
        formData.append("file", file);

        try {
            const response = await axios.post(
                "https://pdftextextractor.onrender.com/api/pdf/upload",
                formData,
                {
                    headers: { "Content-Type": "multipart/form-data" },
                    formData: true,
                }
            );

            setInfo(response?.data?.info);
            const formattedText = response?.data?.text.replace(/\n/g, "<br>");
            setText(formattedText);
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <main >
            <div className="main-app">
                <div className="buttons">
                    <label htmlFor="file-input" className="file-input">
                        Choose a pdf file
                    </label>
                    <input
                        type="file"
                        accept=".pdf"
                        id="file-input"
                        className="file-input"
                        onChange={handleFileChange}
                        name="file-input"
                    />
                    <button onClick={handleSubmit} disabled={!file}>
                        Upload and Extract
                    </button>
                </div>
                {!text && !info && <div className="no-text"><p>no extracted text yet..</p></div>}
                {text && (
                    <div style={{width: '100%', height: '100%'}}>
                        <br/>
                        <h2>Extracted Text:</h2>
                        
                        <p className="text" dangerouslySetInnerHTML={{ __html: text }}></p>

                    </div>
                )}
                {info && (
                    <div>
                        <h2>Extracted Info:</h2>
                        <div className="info-container">
                            first name: {info?.firstName}
                        </div>
                        <div className="info-container">
                            last name: {info?.lastName}
                        </div>
                        <div className="info-container">
                            application end date: {info?.requestedEndDate}
                        </div>
                        <div className="info-container">
                            telephone number: {info?.telephoneNumber}
                        </div>
                        <div className="info-container">
                            nationality: {info?.nationality}
                        </div>
                    </div>
                )}
            </div>
        </main>
    );
};

export default Main;
