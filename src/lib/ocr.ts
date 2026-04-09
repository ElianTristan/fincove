import Tesseract from 'tesseract.js'

export interface OcrResult {
  text: string
  confidence: number
  amount: number | null
  date: string | null
  merchant: string | null
}

export async function processReceiptImage(imageData: string | File): Promise<OcrResult> {
  try {
    const result = await Tesseract.recognize(
      imageData,
      'spa+eng',
      {
        logger: (m) => console.log(m),
      }
    )

    const text = result.data.text
    const confidence = result.data.confidence

    // Extract amount (looking for currency patterns)
    const amountMatch = text.match(/[\$\€\£]\s*(\d{1,3}(?:,\d{3})*\.?\d{2})/) ||
                         text.match(/(\d{1,3}(?:,\d{3})*\.?\d{2})/)
    const amount = amountMatch ? parseFloat(amountMatch[1].replace(',', '')) : null

    // Extract date (common formats)
    const dateMatch = text.match(/(\d{1,2}[\/\-]\d{1,2}[\/\-]\d{2,4})/) ||
                      text.match(/(\d{4}[\/\-]\d{1,2}[\/\-]\d{1,2})/)
    const date = dateMatch ? dateMatch[1] : null

    // Extract merchant (first line or line containing common store keywords)
    const lines = text.split('\n').filter(line => line.trim())
    let merchant = lines[0] || null

    // Look for store/restaurant indicators
    const merchantKeywords = ['store', 'restaurant', 'café', 'market', 'shop', 'mart', 'rest']
    for (const line of lines) {
      if (merchantKeywords.some(keyword => line.toLowerCase().includes(keyword))) {
        merchant = line.trim()
        break
      }
    }

    return {
      text,
      confidence,
      amount,
      date,
      merchant: merchant?.slice(0, 50) || null,
    }
  } catch (error) {
    console.error('OCR Error:', error)
    return {
      text: '',
      confidence: 0,
      amount: null,
      date: null,
      merchant: null,
    }
  }
}

export function extractAmountFromText(text: string): number | null {
  // Common patterns for amounts
  const patterns = [
    /TOTAL[\s:]*[\$\€\£]?\s*(\d{1,3}(?:,\d{3})*\.?\d{2})/i,
    /AMOUNT[\s:]*[\$\€\£]?\s*(\d{1,3}(?:,\d{3})*\.?\d{2})/i,
    /[\$\€\£]\s*(\d{1,3}(?:,\d{3})*\.?\d{2})/,
    /(\d{1,3}(?:,\d{3})*\.\d{2})/,
  ]

  for (const pattern of patterns) {
    const match = text.match(pattern)
    if (match) {
      const amount = parseFloat(match[1].replace(/,/g, ''))
      if (!isNaN(amount) && amount > 0) {
        return amount
      }
    }
  }

  return null
}
