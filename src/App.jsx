import React, { useState } from 'react';
import axios from 'axios';

function App() {
    const [image, setImage] = useState(null);
    const [result, setResult] = useState(null);

    const handleImageChange = (event) => {
        setImage(event.target.files[0]);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        const formData = new FormData();
        formData.append('image', image);

        try {
            const response = await axios.post(`http://localhost:3000/api/upload`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            setResult(response.data.result);
        } catch (error) {
            console.error('Error uploading image:', error);
        }
    };

    return (
        <div className="App">
            <h1>Image Recognition App</h1>
            <form onSubmit={handleSubmit}>
                <input type="file" accept="image/*" onChange={handleImageChange} />
                <button type="submit">Upload</button>
            </form>

            {result && (
                <div>
                    <h2>Description</h2>
                    <p>{result}</p>
                </div>
            )}
        </div>
    );
}

export default App;