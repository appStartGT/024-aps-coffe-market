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
});

const PDFPagos = ({ title, content }) => {
  return (
    <Document>
      <Page style={styles.page}>
        <View style={styles.header}>
          <Image src="/img/png/moneycoi.png" />
        </View>
        <View>
          <Text style={styles.title}>{'Comprobante'}</Text>
          <Text
            style={styles.description}
          >{`${title} | año: ${content.year} | Fecha: ${content.createdAt}`}</Text>
        </View>
        <View style={styles.content}>
          <Text style={styles.listItem}>{content.description} </Text>
        </View>
        <View>
          <Text style={styles.total}>
            {`Total: Q ${content?.payment?.toLocaleString(undefined, {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}`}
          </Text>
        </View>
      </Page>
    </Document>
  );
};

export default PDFPagos;
