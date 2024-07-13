import { google, sheets_v4 } from 'googleapis'

const SHEET_ID: string = '1uvsRKfWusyAZUYh8MrbPLSVcS-eyaJgsmAIpoiumdGM'

async function appendToSheet(values: (string | number | boolean)[]): Promise<void> {
  const auth = new google.auth.GoogleAuth({
      keyFile: "C:/git/farcaster-frames/action-to-db/credentials/farcaster-425716-2e224a4536bb.json",
      scopes: ["https://www.googleapis.com/auth/spreadsheets"]
  })
  const sheet: sheets_v4.Sheets = google.sheets("v4")
  await sheet.spreadsheets.values.append({
      spreadsheetId: SHEET_ID,
      auth: auth,
      range: "Sheet1",
      valueInputOption: "RAW",
      requestBody: {
        values: [values.map(value => value === '' ? 'null' : value)] // Replace empty strings with 'null'
      }
  })
}

export { appendToSheet }
