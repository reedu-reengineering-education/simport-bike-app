import useBLEDevice from '@/lib/useBLE'
import { Barcode, BarcodeScanner } from '@capacitor-mlkit/barcode-scanning'
import { QrCodeIcon } from 'lucide-react'
import { Button } from '../ui/button'

export default function ConnectWithCamera() {
  const { connect } = useBLEDevice({
    namePrefix: 'senseBox',
  })

  async function handleScanResults(results: Barcode[]) {
    for (const barcode of results) {
      if (barcode.format === 'QR_CODE' && barcode.valueType === 'TEXT') {
        try {
          await connect(barcode.rawValue)
          return
        } catch (_error) {
          continue
        }
      }
    }
  }

  return (
    <Button
      size={'sm'}
      className="w-fit"
      variant={'ghost'}
      onClick={async () => {
        try {
          const { barcodes } = await BarcodeScanner.scan()
          handleScanResults(barcodes)
        } catch (error) {
          console.error(error)
        }
      }}
    >
      <QrCodeIcon className="h-4" />
    </Button>
  )
}
