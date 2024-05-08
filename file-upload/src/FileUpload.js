import React, { useState, useEffect } from 'react';
import axios from 'axios';

function FileUpload() {
    const [file, setFile] = useState(null);
    const [uploadedFiles, setUploadedFiles] = useState([]);

    useEffect(() => {
        // Fetch uploaded files when component mounts
        const fetchFiles = async () => {
            try {
                const res = await axios.get('http://localhost:3001/files');
                setUploadedFiles(res.data);
            } catch (err) {
                console.error(err);
            }
        };
        fetchFiles();
    }, []); // Run only once on component mount

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('file', file);

        try {
            const res = await axios.post('http://localhost:3001/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            console.log(res.data);
            // Update the list of uploaded files after successful upload
            setUploadedFiles([...uploadedFiles, res.data]);
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div>
            <h2>File Upload</h2>
            <form onSubmit={handleSubmit}>
                <input type="file" onChange={handleFileChange} />
                <button type="submit">Upload</button>
            </form>
            <h2>Uploaded Files:</h2>
            <ul>
                {uploadedFiles.map((file, index) => (
                    <li key={index}>
                        <a href={file.url} target="_blank" rel="noopener noreferrer">{file.name}</a>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default FileUpload;
