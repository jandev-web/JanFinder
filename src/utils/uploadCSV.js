export async function uploadCSVFile(quoteID, file) {
    console.log('uploadCSVFile', quoteID);
    const apiKey = import.meta.env.VITE_UPLOAD_DIAGRAM_KEY;
    const url = import.meta.env.VITE_UPLOAD_DIAGRAM;

    return new Promise((resolve, reject) => {
        const reader = new FileReader();

        reader.onload = async function (event) {
            try {
                const arrayBuffer = event.target.result;
                const base64CSV = btoa(String.fromCharCode(...new Uint8Array(arrayBuffer)));
                const response = await fetch(url, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'x-api-key': apiKey
                    },
                    body: JSON.stringify({
                        quoteID: quoteID,
                        quoteCSV: base64CSV
                    })
                });

                if (!response.ok) {
                    const errorDetails = await response.json();
                    reject(new Error(`Failed to upload CSV: ${errorDetails.message}`));
                }

                const data = await response.json();
                
                resolve(data);
            } catch (error) {
                reject(error);
            }
        };

        reader.onerror = function (error) {
            reject(error);
        };

        reader.readAsArrayBuffer(file);
    });
}

