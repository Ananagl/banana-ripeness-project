import React, { useState } from 'react';
import Webcam from 'react-webcam';

const PredictBanana = () => {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);
  const [useWebcam, setUseWebcam] = useState(false);
  const [imageCaptured, setImageCaptured] = useState(false);

  const webcamRef = React.useRef(null);

  const handleImageChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile));
      setUseWebcam(false);
    }
  };

  const handleCapture = () => {
    const imageSrc = webcamRef.current.getScreenshot();
    if (imageSrc) {
      setPreview(imageSrc);
      setFile(dataURItoBlob(imageSrc));
      setImageCaptured(true);
    }
  };

  const handleRetake = () => {
    setImageCaptured(false);
    setPreview(null);
  };

  const handleSubmit = async (e) => {
    e?.preventDefault();

    if (!file) {
      alert("Por favor, selecciona una imagen.");
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch('http://127.0.0.1:5000/predict', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();
      setPrediction(data.predicted_class);
    } catch (error) {
      console.error("Error en la predicción", error);
    }

    setLoading(false);
  };

  const dataURItoBlob = (dataURI) => {
    const byteString = atob(dataURI.split(',')[1]);
    const mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);
    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }
    return new Blob([ab], { type: mimeString });
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-2xl font-bold text-center mb-6">Predicción de Maduración de Banana</h1>
      
      <form className="flex flex-col items-center gap-4 mb-6" onSubmit={handleSubmit}>
        <input 
          type="file" 
          onChange={handleImageChange} 
          className="block w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 cursor-pointer focus:outline-none focus:ring focus:ring-blue-300"
        />
        <button 
          type="button" 
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600" 
          onClick={() => setUseWebcam(!useWebcam)}>
          {useWebcam ? "Usar Subida de Imagen" : "Usar Webcam"}
        </button>
        <button 
          type="submit" 
          className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600" 
          disabled={loading || (useWebcam && !imageCaptured)}>
          Enviar
        </button>
      </form>

      {loading && <p className="text-blue-500 text-center">Cargando...</p>}

      {useWebcam && !imageCaptured ? (
        <div className="flex flex-col items-center">
          <Webcam 
            audio={false} 
            ref={webcamRef} 
            screenshotFormat="image/jpeg" 
            className="border rounded-md shadow-lg"
          />
          <button 
            onClick={handleCapture} 
            className="mt-4 px-4 py-2 bg-yellow-500 text-white rounded-md hover:bg-yellow-600">
            Capturar Imagen
          </button>
        </div>
      ) : (
        useWebcam &&
        imageCaptured && (
          <div className="flex flex-col items-center">
            <h3 className="text-lg font-semibold mb-4">Imagen Capturada:</h3>
            <img 
              src={preview} 
              alt="Imagen capturada" 
              className="w-56 h-56 object-cover rounded-lg mb-4" 
            />
            <div className="flex gap-4">
              <button 
                onClick={handleRetake} 
                className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600">
                Tomar Otra
              </button>
              <button 
                onClick={handleSubmit} 
                className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600">
                Usar Esta
              </button>
            </div>
          </div>
        )
      )}

      {!useWebcam && preview && (
        <img 
          src={preview} 
          alt="Imagen seleccionada" 
          className="w-56 h-56 object-cover rounded-lg mx-auto mb-6" 
        />
      )}

      {prediction && <p className="text-center text-lg text-green-700">La banana está en el nivel: {prediction}</p>}
    </div>
  );
};

export default PredictBanana;
