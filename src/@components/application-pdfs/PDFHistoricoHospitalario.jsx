import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Image,
} from '@react-pdf/renderer';

// Estilos para el PDF
const styles = StyleSheet.create({
  page: {
    fontFamily: 'Helvetica',
    fontSize: 12,
    paddingBottom: '60px',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    width: '100%',
  },
  headerBackground: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  title: {
    fontSize: 20,
    fontWeight: 700,
    textAlign: 'left',
    color: '#094067',
    paddingLeft: 60,
    paddingRight: 60,
  },
  titleTable: {
    fontSize: 14,
    fontWeight: 700,
    textAlign: 'left',
    color: '#094067',
  },
  total: {
    fontSize: 16,
    fontWeight: 700,
    textAlign: 'left',
    color: '#094067',
    marginTop: 16,
    paddingLeft: 60,
    paddingRight: 60,
  },
  description: {
    fontSize: 12,
    fontWeight: 700,
    textAlign: 'left',
    color: '#6B7280',
    marginTop: 4,
    marginBottom: 12,
    paddingLeft: 60,
    paddingRight: 60,
  },
  content: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    width: '100%',
    paddingTop: 16,
    paddingLeft: 60,
    paddingRight: 60,
    paddingBottom: 4,
  },
  listItem: {
    marginBottom: 10,
    color: '#6B7280',
    width: '100%',
  },
  listItemTitle: {
    marginTop: 12,
    marginBottom: 4,
    color: '#000000',
  },
  listItemDescription: {
    marginBottom: 2,
    color: '#6B7280',
  },
  applicantImg: {
    width: '64px',
    height: '64px',
    marginBottom: '12px',
  },

  //ESTILOS PARA TABLA
  table: {
    width: '100%',
    marginTop: 16,
    borderWidth: 1,
    borderColor: '#094067',
  },
  tableHeader: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    backgroundColor: '#094067',
    borderColor: '#094067',
    color: '#FFFFFF',
    alignItems: 'center',
    padding: 8,
  },
  tableRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    flexWrap: 'wrap',
  },
  tableCell: {
    flex: 1,
  },
});

const PDFTable = ({ headers, data }) => {
  const firstColumnWidth = '80%'; // Define el ancho de la primera columna
  const secondColumnWidth = '20%'; // Define el ancho de la segunda columna
  return (
    <View style={styles.table}>
      <View style={styles.tableHeader}>
        {headers.map((header, index) => (
          <Text
            key={index}
            style={
              (styles.tableCell,
              {
                width:
                  header === headers[0] ? firstColumnWidth : secondColumnWidth,
              })
            }
          >
            {header}
          </Text>
        ))}
      </View>
      {data.map((row, rowIndex) => (
        <View key={rowIndex} style={styles.tableRow}>
          {headers.map((header, cellIndex) => (
            <Text
              key={cellIndex}
              style={
                (styles.tableCell,
                {
                  width:
                    header === headers[0]
                      ? firstColumnWidth
                      : secondColumnWidth,
                })
              }
            >
              {row[header]}
            </Text>
          ))}
        </View>
      ))}
    </View>
  );
};

const PDFHistoricoHospitalario = ({ title, content }) => {
  const headers = ['Descripción', 'Subtotal']; // Ejemplo de encabezados de la tabla
  const productsTable = content.products?.length
    ? content.products.map((item) => ({
        Descripción: item.name,
        Subtotal: `Q ${
          item.subtotal?.toLocaleString(undefined, {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          }) || '0.00'
        }`,
      }))
    : [];
  const hospitalarioTable = content?.hospitalario?.length
    ? content.hospitalario.map((item) => ({
        Descripción: item.name,
        Subtotal: `Q ${
          item.subtotal?.toLocaleString(undefined, {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          }) || '0.00'
        }`,
      }))
    : [];
  const laboratorioTable = content?.laboratorio?.length
    ? content.laboratorio.map((item) => ({
        Descripción: item.name,
        Subtotal: `Q ${
          item.subtotal?.toLocaleString(undefined, {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          }) || '0.00'
        }`,
      }))
    : [];
  const honorariosTable = content?.honorarios?.length
    ? content.honorarios.map((item) => ({
        Descripción: item.name,
        Subtotal: `Q ${
          item.subtotal?.toLocaleString(undefined, {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          }) || '0.00'
        }`,
      }))
    : [];

  return (
    <Document>
      <Page style={styles.page}>
        <View style={styles.header} fixed>
          <Image src="/img/png/header_sanatorio.png" />
        </View>
        <View>
          <Text style={styles.title}>{'Comprobante'}</Text>
          <Text
            style={styles.description}
          >{`${title} | NIT: ${content.NIT} | Fecha: ${content.createdAt}`}</Text>
        </View>
        {!!productsTable.length && (
          <View wrap={false} style={styles.content}>
            <Text style={styles.titleTable}>Productos/Medicamentos</Text>
            <PDFTable headers={headers} data={productsTable} />
          </View>
        )}
        {!!hospitalarioTable.length && (
          <View wrap={false} style={styles.content}>
            <Text style={styles.titleTable}>Hospitalario</Text>
            <PDFTable headers={headers} data={hospitalarioTable} />
          </View>
        )}
        {!!laboratorioTable.length && (
          <View wrap={false} style={styles.content}>
            <Text style={styles.titleTable}>Laboratorio</Text>
            <PDFTable headers={headers} data={laboratorioTable} />
          </View>
        )}
        {!!honorariosTable.length && (
          <View wrap={false} style={styles.content}>
            <Text style={styles.titleTable}>Honorarios</Text>
            <PDFTable headers={headers} data={honorariosTable} />
          </View>
        )}
        <View wrap={false}>
          <Text style={styles.total}>
            {`Total: Q ${content.total?.toLocaleString(undefined, {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}`}
          </Text>
        </View>
      </Page>
    </Document>
  );
};

export default PDFHistoricoHospitalario;
