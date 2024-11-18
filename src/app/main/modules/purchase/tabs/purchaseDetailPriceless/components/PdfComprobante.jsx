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
    paddingBottom: '40px',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    marginBottom: 20,
    paddingHorizontal: 60,
    marginTop: 25,
  },
  headerLogo: {
    width: 100,
    height: 'auto',
  },
  headerText: {
    fontSize: 10,
    color: '#6B7280',
  },
  purchaseCode: {
    fontSize: 10,
    color: '#6B7280',
    marginBottom: 4,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#094067',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 14,
    fontWeight: 'medium',
    textAlign: 'center',
    color: '#3DA9FC',
    marginBottom: 20,
  },
  content: {
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
    paddingHorizontal: 60,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#094067',
    marginBottom: 8,
  },
  listItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  listItemLabel: {
    color: '#5F6C7B',
  },
  listItemValue: {
    color: '#094067',
    fontWeight: 'medium',
  },
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 60,
    right: 60,
    textAlign: 'center',
    color: '#5F6C7B',
    fontSize: 10,
  },
});

const PdfComprobante = ({ title, purchaseCode, content }) => {
  const totalAdvancePayment =
    content.advancePayments?.reduce(
      (sum, payment) => sum + payment.amount,
      0
    ) || 0;

  return (
    <Document>
      <Page style={styles.page}>
        <View style={styles.header}>
          {/* <Image style={styles.headerLogo} src="/img/png/moneycoi.png" /> */}
          <View>
            <Text style={styles.purchaseCode}>ID: {purchaseCode}</Text>
            <Text style={styles.headerText}>
              Fecha: {new Date().toLocaleDateString()}
            </Text>
          </View>
        </View>

        <Text style={styles.title}>Comprobante de Compra</Text>
        <Text style={styles.subtitle}>{title}</Text>

        <View style={styles.content}>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Información del Cliente</Text>
            <View style={styles.listItem}>
              <Text style={styles.listItemLabel}>Nombre:</Text>
              <Text style={styles.listItemValue}>
                {content.customerName || 'No especificado'}
              </Text>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Detalles de la Compra</Text>
            <View style={styles.listItem}>
              <Text style={styles.listItemLabel}>Descripción:</Text>
              <Text style={styles.listItemValue}>{content.description}</Text>
            </View>
            <View style={styles.listItem}>
              <Text style={styles.listItemLabel}>Cantidad:</Text>
              <Text style={styles.listItemValue}>
                {`${content.quantity.toLocaleString()} libras (${(
                  content.quantity / 100
                ).toLocaleString()} quintales)`}
              </Text>
            </View>
            <View style={styles.listItem}>
              <Text style={styles.listItemLabel}>Fecha de Transacción:</Text>
              <Text style={styles.listItemValue}>{content.createdAt}</Text>
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
        </View>

        <Text style={styles.footer}>
          Este documento es un comprobante oficial de la transacción realizada.
          Por favor, consérvelo para sus registros.
        </Text>
      </Page>
    </Document>
  );
};

export default PdfComprobante;
