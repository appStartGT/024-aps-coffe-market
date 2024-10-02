import React from 'react';
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Font,
  Image,
} from '@react-pdf/renderer';

// Registrar la fuente "Courier"
Font.register({
  family: 'Courier',
  src: 'https://fonts.gstatic.com/s/courierprime/v11/u-450q2lgwslOqpF4FtaYOY3B8Gdtbp5pIAi.ttf',
});

const styles = StyleSheet.create({
  page: {
    fontFamily: 'Courier',
    fontSize: 9,
    padding: 10,
    width: 216, // Ancho en puntos para un papel de 76.2 mm (3 pulgadas)
    height: 360, // Altura en puntos para un papel de 127 mm (5 pulgadas)
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  header: {
    textAlign: 'center',
    marginBottom: 10,
  },
  headerImage: {
    width: 50, // Tamaño de la imagen en puntos
    height: 50,
    marginBottom: 10,
    alignSelf: 'center', // Centrar la imagen en el header
  },
  footer: {
    marginTop: 10,
    textAlign: 'center',
  },
  content: {
    flexDirection: 'column',
    width: '100%',
  },
  customerDetails: {
    marginBottom: 10,
    textAlign: 'left',
  },
  tableHeader: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#000',
    marginBottom: 5,
    paddingBottom: 5,
  },
  tableRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  columnHeader: {
    fontWeight: 'bold',
    textAlign: 'left',
    fontSize: 9,
  },
  column: {
    textAlign: 'left',
    fontSize: 9,
    paddingRight: 10, // Agrega un poco de padding a la derecha
  },
  columnTotal: {
    textAlign: 'right',
    fontSize: 9,
    paddingLeft: 10, // Agrega un poco de padding a la izquierda
  },
  total: {
    fontSize: 11,
    fontWeight: 'bold',
    marginTop: 15, // Aumentado para darle más espacio respecto al contenido anterior
    textAlign: 'right',
  },
});

const PDFTicket = ({ content }) => {
  const headerDetails = [
    { text: 'DOBLADAS SAN CARLOS', isBold: true },
    { text: 'INVERSIONES SUTILES, S.A.' },
    { text: 'NIT: 7061098-3' },
    { text: 'Centro Comercial Eco Centro Local R1' },
    { text: 'O Calle C-60 Zona 7 Colonia Villa Hermosa' },
    { text: 'San Miguel Petapa, Guatemala' },
  ];

  const additionalDetails = [
    'Fecha: 2024-08-20',
    'Factura N° 123456789',
    'Documento Tributario Electrónico',
    'Autorización SAT: 987654321',
    'Rango autorizado: 100000 a 199999',
  ];

  const footerDetails = [
    'Gracias por su compra',
    'Retención Definitiva',
    'Recuerde revisar bien su compra antes de retirarse',
    'Atendido por: Juan Pérez',
    'Teléfono: 5555-5555',
    'Correo: contacto@dobladassancarlos.com',
  ];

  return (
    <Document>
      <Page size={[216, 360]} style={styles.page}>
        {/* Renderizar Header solo si hay detalles */}
        {headerDetails && (
          <View style={styles.header}>
            {content.headerImage && (
              <Image style={styles.headerImage} src="/img/png/Darth.png" />
            )}
            {headerDetails.map((detail, index) => (
              <Text
                key={index}
                style={{
                  fontWeight: detail.isBold ? 'bold' : 'normal',
                  fontSize: detail.isBold ? 11 : 9,
                }}
              >
                {detail.text}
              </Text>
            ))}
          </View>
        )}

        {/* Renderizar información adicional solo si hay detalles */}
        {additionalDetails && (
          <View style={{ textAlign: 'center', marginBottom: 10 }}>
            {additionalDetails.map((detail, index) => (
              <Text key={index} style={{ fontSize: 9 }}>
                {detail}
              </Text>
            ))}
          </View>
        )}

        <View style={styles.customerDetails}>
          <Text style={{ fontSize: 9 }}>
            Nombre: {content.client || 'CONSUMIDOR FINAL'}
          </Text>
          <Text style={{ fontSize: 9 }}>
            Dirección: {content.address || 'CIUDAD'}
          </Text>
          <Text style={{ fontSize: 9 }}>NIT: {content.NIT || 'CF'}</Text>
        </View>

        {/* Títulos de la tabla */}
        <View style={styles.tableHeader}>
          <Text style={[styles.columnHeader, { width: '15%' }]}>CANT</Text>
          <Text
            style={[styles.columnHeader, { width: '55%', textAlign: 'center' }]}
          >
            DESCRIPCIÓN
          </Text>
          <Text
            style={[styles.columnHeader, { width: '30%', textAlign: 'right' }]}
          >
            TOTAL
          </Text>
        </View>

        {/* Contenido dinámico - productos */}
        <View style={styles.content}>
          {content.detail.map((item, index) => (
            <View key={index} style={styles.tableRow}>
              <Text style={[styles.column, { width: '15%' }]}>
                {item.quantity}
              </Text>
              <Text
                style={[styles.column, { width: '55%', textAlign: 'center' }]}
              >
                {item.name}
              </Text>
              <Text
                style={[styles.columnTotal, { width: '30%' }]}
              >{`Q ${item.subTotal.toFixed(2)}`}</Text>
            </View>
          ))}
        </View>

        <View>
          <Text style={styles.total}>
            {`Total: Q ${content.total.toFixed(2)}`}
          </Text>
        </View>

        {/* Renderizar Footer solo si hay detalles */}
        {footerDetails && (
          <View style={styles.footer}>
            {footerDetails.map((detail, index) => (
              <Text key={index} style={{ fontSize: 9 }}>
                {detail}
              </Text>
            ))}
          </View>
        )}
      </Page>
    </Document>
  );
};

export default PDFTicket;
