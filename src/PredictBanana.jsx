import React, { useState } from 'react';
import Webcam from 'react-webcam';
import Banano from './img/banane.png';


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
    <div className="bg-[#faf3e4] min-h-screen">
      <nav className="bg-[#f2d680] text-white px-4 py-3 shadow-md">
        <div className="container mx-auto flex justify-between items-center">
          <div className="text-xl font-bold tracking-wider">
            <img
              src={Banano}
              alt="Logo de banano"
              className="h-10 w-auto object-contain"
            />
             

          </div>
          <h2 className="text-0.5 font-semibold text-center text-[#8c6c3e]">
          Ana Nagles, Maria Rincon
        </h2>
        </div>
      </nav>

      <div className="max-w-2xl mx-auto p-10">
        <h1 className="text-4xl font-extrabold text-center mb-6 text-gray-800">
          Sistema de Predicción de Maduración de Bananas
        </h1>
        <h2 className="text-2xl font-semibold text-center mb-4 text-[#8c6c3e]">
          ¿Qué tan madura está tu banana?
        </h2>

        <form
          className="flex flex-col items-center gap-6 p-6 bg-white rounded-lg shadow-lg"
          onSubmit={handleSubmit}
        >
          <input
            type="file"
            onChange={handleImageChange}
            className="block w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 cursor-pointer shadow-md hover:shadow-lg transition focus:ring-2 focus:ring-[#f2d680] focus:outline-none px-4 py-2 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-[#f2d680] file:text-gray-900 hover:file:bg-[#ddb56f]"
          />

          <button
            type="button"
            className="px-4 py-2 bg-[#f2a104] text-white font-medium rounded-lg shadow-md hover:bg-[#e68b00] transition"
            onClick={() => setUseWebcam(!useWebcam)}
          >
            {useWebcam ? "Usar Subida de Imagen" : "Usar Webcam"}
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-green-600 text-white font-medium rounded-lg shadow-md hover:bg-green-700 transition disabled:bg-gray-400"
            disabled={loading || (useWebcam && !imageCaptured)}
          >
            {loading ? "Enviando..." : "Enviar"}
          </button>
        </form>

        {loading && (
          <p className="mt-6 text-center text-lg text-[#f2a104] animate-pulse">
            Cargando...
          </p>
        )}

        {useWebcam && !imageCaptured ? (
          <div className="flex flex-col items-center mt-6">
            <Webcam
              audio={false}
              ref={webcamRef}
              screenshotFormat="image/jpeg"
              className="border rounded-lg shadow-lg w-64 h-48"
            />
            <button
              onClick={handleCapture}
              className="mt-4 px-4 py-2 bg-[#f2d680] text-gray-800 font-medium rounded-lg shadow-md hover:bg-[#ddb56f] transition"
            >
              Capturar Imagen
            </button>
          </div>
        ) : (
          useWebcam &&
          imageCaptured && (
            <div className="flex flex-col items-center mt-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                Imagen Capturada:
              </h3>
              <img
                src={preview}
                alt="Imagen capturada"
                className="w-56 h-56 object-cover rounded-lg shadow-md mb-4"
              />
              <div className="flex gap-4">
                <button
                  onClick={handleRetake}
                  className="px-4 py-2 bg-red-500 text-white font-medium rounded-lg shadow-md hover:bg-red-600 transition"
                >
                  Tomar Otra
                </button>
                <button
                  onClick={handleSubmit}
                  className="px-4 py-2 bg-green-600 text-white font-medium rounded-lg shadow-md hover:bg-green-700 transition"
                >
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
            className="w-56 h-56 object-cover rounded-lg mx-auto mt-6 shadow-lg"
          />
        )}

        {prediction && (
          <p className="mt-8 text-center text-xl font-semibold text-green-700">
            La banana está en el nivel: {prediction}
          </p>
        )}
      </div>
    </div>
  );
};

export default PredictBanana;