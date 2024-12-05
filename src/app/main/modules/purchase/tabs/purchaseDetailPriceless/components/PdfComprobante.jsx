import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  // Image,
} from '@react-pdf/renderer';

// Estilos para el PDF
const styles = StyleSheet.create({
  page: {
    fontFamily: 'Helvetica',
    fontSize: 8, // Reduced font size
    paddingBottom: '20px', // Reduced padding
    paddingTop: '20px',
    height: '50%', // Set height to 50% of the page
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    marginBottom: 10, // Reduced margin
    paddingHorizontal: 20, // Reduced padding
  },
  headerText: {
    fontSize: 8,
    color: '#4A5568',
    fontWeight: 'bold',
  },
  purchaseCode: {
    fontSize: 8,
    color: '#4A5568',
    marginBottom: 2,
    fontWeight: 'bold',
  },
  title: {
    fontSize: 18, // Reduced font size
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#2D3748',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 10,
    fontWeight: 'medium',
    textAlign: 'center',
    color: '#4A5568',
    marginBottom: 4,
  },
  content: {
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
    paddingHorizontal: 20,
  },
  section: {
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#2D3748',
    marginBottom: 5,
    borderBottom: '1 solid #E2E8F0',
    paddingBottom: 2,
  },
  listItem: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    marginBottom: 4,
  },
  listItemLabel: {
    color: '#4A5568',
    marginRight: 5,
    width: '30%',
  },
  listItemValue: {
    color: '#2D3748',
    fontWeight: 'medium',
    width: '70%',
  },
  footer: {
    marginTop: 40, // Reduced margin
    marginLeft: 20,
    marginRight: 20,
    bottom: 15,
    textAlign: 'center',
    color: '#718096',
    fontSize: 7,
    borderTop: '1 solid #E2E8F0',
    paddingTop: 5,
  },
  signature: {
    marginTop: 40, // Reduced margin
    borderTop: '1 solid #718096',
    width: '60%',
    alignSelf: 'center',
    textAlign: 'center',
    paddingTop: 2,
  },
  logo: {
    width: 50, // Reduced size
    height: 50,
  },
  pageHeader: {
    fontSize: 8,
    color: '#4A5568',
    textAlign: 'center',
    marginBottom: 20, // Reduced margin
    paddingHorizontal: 20,
  },
  boldText: {
    fontWeight: 'bold',
    color: '#000',
  },
});

const PdfComprobante = ({ _, purchaseCode, content }) => {
  const totalAdvancePayment =
    content.advancePayments?.reduce(
      (sum, payment) => sum + payment.amount,
      0
    ) || 0;

  return (
    <Document>
      <Page style={styles.page}>
        <Text style={styles.subtitle}>COMPRA DE CAFÉ</Text>
        <Text style={styles.title}>DELICIA DEL CAFE</Text>
        <Text style={styles.pageHeader}>
          Estoy ubicado en el Kilómetro 87.5 Ruta a El Salvador, a 100 metros
          antes de entrada a San José Acatempa, Jutiapa{'\n'}
          SIEMPRE OFRECIÉNDOLE UN MEJOR PRECIO{'\n'}
          Prop. Lic. M.A. Donaldo Cano Pernillo{'\n'}
          ¡Será un gusto atenderle!{'\n'}
          TELÉFONOS: 3047-9284
        </Text>

        <View style={styles.header}>
          {/* <Image style={styles.logo} src="/path/to/your/logo.png" /> */}
          <View>
            <Text style={styles.purchaseCode}>
              <Text style={styles.boldText}>Código de comprobante: </Text>
              {purchaseCode}
            </Text>
            <Text style={styles.headerText}>
              <Text style={styles.boldText}>Fecha: </Text>
              {new Date().toLocaleDateString()}
            </Text>
          </View>
        </View>

        <View style={styles.content}>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Información de la Compra</Text>
            <View style={styles.listItem}>
              <Text style={styles.listItemLabel}>Recibí de:</Text>
              <Text style={styles.listItemValue}>
                {content.customerName || 'No especificado'}
              </Text>
            </View>
            <View style={styles.listItem}>
              <Text style={styles.listItemLabel}>Quintales:</Text>
              <Text style={styles.listItemValue}>
                {`${(content.quantity / 100).toLocaleString()} quintales`}
                {` (${content.quantity.toLocaleString()} libras)`}
              </Text>
            </View>
            <View style={styles.listItem}>
              <Text style={styles.listItemLabel}>Lugar y Fecha:</Text>
              <Text style={styles.listItemValue}>
                San José Acatempa, {content.createdAt}
              </Text>
            </View>
          </View>

          {content.advancePayments && content.advancePayments.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Pagos Anticipados</Text>
              {content.advancePayments.map((payment, index) => (
                <View key={index} style={styles.listItem}>
                  <Text style={styles.listItemLabel}>{`Pago ${
                    index + 1
                  }:`}</Text>
                  <Text style={styles.listItemValue}>
                    {`Q ${payment.amount.toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}`}
                  </Text>
                </View>
              ))}
              <View style={styles.listItem}>
                <Text style={styles.listItemLabel}>Total Anticipos:</Text>
                <Text style={styles.listItemValue}>
                  {`Q ${totalAdvancePayment.toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}`}
                </Text>
              </View>
            </View>
          )}

          <View style={styles.signature}>
            <Text>Firma</Text>
          </View>
        </View>

        <Text style={styles.footer}>
          DELICIA DEL CAFE | Kilómetro 87.5 Ruta a El Salvador, a 100 metros
          antes de entrada a San José Acatempa, Jutiapa | Tel: 3047-9284 | Este
          documento es un comprobante oficial de la transacción realizada. Por
          favor, consérvelo para sus registros.
        </Text>
      </Page>
    </Document>
  );
};

export default PdfComprobante;
