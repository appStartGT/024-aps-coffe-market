import React from 'react';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { Button } from '@mui/material';
import { PictureAsPdf } from '@mui/icons-material';
// Función para formatear las etiquetas de las columnas
// const formatLabel = (key, customLabels) => {
//   if (customLabels && customLabels[key]) {
//     return customLabels[key];
//   }
//   return key
//     .replace(/([A-Z])/g, ' $1')
//     .replace(/_/g, ' ')
//     .toUpperCase()
//     .trim();
// };

// Componente para manejar la exportación
const ExcelExportButton = ({ data, customLabels, fileName, fields }) => {
  const handleExport = () => {
    // Preparar los datos con etiquetas modificadas
    const formattedData = data.map((item) => {
      const newItem = {};
      fields.forEach((field) => {
        const label = customLabels[field] || field;
        newItem[label] = item[field];
      });
      return newItem;
    });

    // Convierte los datos JSON formateados a hoja de cálculo
    const worksheet = XLSX.utils.json_to_sheet(formattedData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');

    // Genera un buffer con los datos del libro en formato XLSX
    const excelBuffer = XLSX.write(workbook, {
      bookType: 'xlsx',
      type: 'array',
    });

    // Crea un objeto Blob con los datos del buffer
    const dataBlob = new Blob([excelBuffer], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8',
    });

    // Guarda el archivo usando FileSaver
    saveAs(dataBlob, fileName + '.xlsx');
  };

  return (
    <Button
      onClick={handleExport}
      variant="contained"
      color="primary"
      startIcon={<PictureAsPdf />}
    >
      Descargar Excel
    </Button>
  );
};

export default ExcelExportButton;
