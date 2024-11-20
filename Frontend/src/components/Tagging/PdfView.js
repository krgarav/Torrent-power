import { PDFViewer } from 'pdf-viewer-reactjs';
import { useState } from 'react';

export const renderError = (error) => {
    let message = '';
    switch (error.name) {
        case 'InvalidPDFException':
            message = 'The document is invalid or corrupted';
            break;
        case 'MissingPDFException':
            message = 'The document is missing';
            break;
        case 'UnexpectedResponseException':
            message = 'Unexpected server response';
            break;
        default:
            message = 'Cannot load the document';
            break;
    }
    return (
        <div
            style={{
                alignItems: 'center',
                display: 'flex',
                height: '100%',
                justifyContent: 'center',
            }}
        >
            <div
                style={{
                    backgroundColor: '#e53e3e',
                    borderRadius: '0.25rem',
                    color: '#fff',
                    padding: '0.5rem',
                }}
            >
                {message}
            </div>
        </div>
    );
};

const Preview = ({ pdfFile }) => {


    return (
        <div>
            {pdfFile && (
                <PDFViewer
                    filePath={pdfFile}
                    scale={1.5}
                    navbar={true}
                    spreadsheet={true}
                    renderError={renderError}
                />
            )}
        </div>
    );
};

export default Preview;