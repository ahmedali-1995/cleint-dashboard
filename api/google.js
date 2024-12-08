import { google } from 'googleapis';
import express from 'express';

const router = express.Router();

async function initializeGoogleAuth() {
  try {
    const credentials = JSON.parse(process.env.GOOGLE_CREDENTIALS || '{}');
    console.log('Credentials present:', !!credentials);
    console.log('Credentials type:', credentials.type);
    
    const auth = new google.auth.GoogleAuth({
      credentials,
      scopes: [
        'https://www.googleapis.com/auth/drive.readonly',
        'https://www.googleapis.com/auth/spreadsheets.readonly'
      ]
    });

    return {
      drive: google.drive({ version: 'v3', auth }),
      sheets: google.sheets({ version: 'v4', auth })
    };
  } catch (error) {
    console.error('Auth initialization error:', error);
    throw new Error(`Failed to initialize Google auth: ${error.message}`);
  }
}

router.get('/', async (req, res) => {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    console.log('API Request:', {
      method: req.method,
      query: req.query,
      folderId: process.env.VITE_GOOGLE_DRIVE_FOLDER_ID
    });

    const { username } = req.query;
    const folderId = process.env.VITE_GOOGLE_DRIVE_FOLDER_ID;

    if (!username) {
      console.log('No username provided');
      return res.status(400).json({ error: 'Username is required' });
    }

    if (!folderId) {
      console.log('No folder ID found in environment variables');
      return res.status(500).json({ error: 'Google Drive folder ID not configured' });
    }

    const { drive, sheets } = await initializeGoogleAuth();

    // Find the sheet by username
    console.log(`Searching for sheet with name: ${username} in folder: ${folderId}`);
    const filesResponse = await drive.files.list({
      q: `'${folderId}' in parents and name = '${username}' and mimeType='application/vnd.google-apps.spreadsheet'`,
      fields: 'files(id, name)',
      spaces: 'drive'
    });

    console.log('Files found:', filesResponse.data.files);

    if (!filesResponse.data.files.length) {
      console.log('No matching sheet found');
      return res.status(404).json({ error: 'No sheet found for this user' });
    }

    // Get sheet data specifically from the Overview tab
    const sheetId = filesResponse.data.files[0].id;
    console.log(`Found sheet ID: ${sheetId}`);

    // First, get the sheet metadata to find the Overview tab
    const spreadsheet = await sheets.spreadsheets.get({
      spreadsheetId: sheetId
    });

    console.log('Available sheets:', spreadsheet.data.sheets.map(s => s.properties.title));

    const overviewSheet = spreadsheet.data.sheets.find(
      sheet => sheet.properties.title.toLowerCase() === 'overview'
    );

    if (!overviewSheet) {
      console.log('Overview tab not found');
      return res.status(404).json({ error: 'Overview tab not found in the spreadsheet' });
    }

    // Get the data from the Overview tab
    const sheetResponse = await sheets.spreadsheets.values.get({
      spreadsheetId: sheetId,
      range: 'Overview!A1:M1000' // Columns A through M
    });

    const data = sheetResponse.data.values || [];
    console.log('Data retrieved:', {
      rowCount: data.length,
      hasHeaders: data.length > 0 ? data[0].length : 0
    });

    const headers = data[0] || [];
    const rows = data.slice(1) || [];

    // Transform the data into a more structured format
    const formattedRows = rows.map(row => {
      const rowData = {};
      headers.forEach((header, index) => {
        rowData[header.toLowerCase().replace(/\s+/g, '_')] = row[index] || '';
      });
      return rowData;
    });

    res.status(200).json({
      success: true,
      data: formattedRows[0] || {} // Send only the first row of data
    });
  } catch (error) {
    console.error('API Error:', error);
    res.status(500).json({ 
      error: error.message || 'Internal server error',
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

export default router;
