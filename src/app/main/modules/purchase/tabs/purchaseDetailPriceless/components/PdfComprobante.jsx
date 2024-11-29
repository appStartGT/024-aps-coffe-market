import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';

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
    marginBottom: 14,
  },
  subtitle: {
    fontSize: 12,
    fontWeight: 'medium',
    textAlign: 'center',
    color: '#3DA9FC',
    marginBottom: 10,
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

const PdfComprobante = ({ _, purchaseCode, content }) => {
  const totalAdvancePayment =
    content.advancePayments?.reduce(
      (sum, payment) => sum + payment.amount,
      0
    ) || 0;

  return (
    <Document>
      <Page style={styles.page}>
        <View style={styles.header}>
          <View>
            <Text style={styles.purchaseCode}>ID: {purchaseCode}</Text>
            <Text style={styles.headerText}>
              Fecha: {new Date().toLocaleDateString()}
            </Text>
          </View>
        </View>

        <Text style={styles.subtitle}>COMPRA DE CAFÉ</Text>
        <Text style={styles.title}>DELICIA DEL CAFE</Text>
        <View style={{ alignItems: 'center', marginBottom: '12px' }}>
          <Text style={styles.headerText}>
            Estoy ubicado en el Kilómetro 87.5 Ruta a El Salvador, a 100 metros
            antes de la entrada a San José Acatempa, Jutiapa.
          </Text>
          <Text style={styles.headerText}>
            SIEMPRE OFRECIÉNDOLE UN MEJOR PRECIO
          </Text>
          <Text style={styles.headerText}>
            Prop. Lic. M.A. Donaldo Cano Pernillo ¡Será un gusto atenderle!
          </Text>
          <Text style={styles.headerText}>TELÉFONOS: 3047-9284</Text>
        </View>

        <View style={styles.content}>
          <View style={styles.section}>
            <View style={styles.listItem}>
              <Text style={styles.listItemLabel}>Recibido de:</Text>
              <Text style={styles.listItemValue}>
                {content.customerName || 'No especificado'}
              </Text>
            </View>
          </View>

          <View style={styles.section}>
            <View style={styles.listItem}>
              <Text style={styles.listItemValue}>{content.description}</Text>
            </View>
            <View style={styles.listItem}>
              <Text style={styles.listItemLabel}>Quintales:</Text>
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
