/**
 * Google Apps Script Webhook for Traffic Light Experiment Tracking
 * 
 * SETUP INSTRUCTIONS:
 * 
 * 1. Create a new Google Sheet:
 *    - Go to https://sheets.google.com
 *    - Create a new spreadsheet
 *    - Name it "Traffic Light Experiment Data" (or your preferred name)
 * 
 * 2. Set up the header row (Row 1):
 *    - In cell A1, type: timestamp
 *    - In cell B1, type: participantId
 *    - In cell C1, type: eventType
 *    - In cell D1, type: articleId
 *    - In cell E1, type: trafficLightStatus
 *    - In cell F1, type: misleadingScore
 *    - In cell G1, type: elementType
 *    - In cell H1, type: context
 *    - In cell I1, type: durationMs
 *    - In cell J1, type: hoverDurationMs
 *    - In cell K1, type: sessionStart
 *    - In cell L1, type: sessionEnd
 *    - In cell M1, type: rawData
 * 
 * 3. Open Apps Script:
 *    - In your Google Sheet, go to Extensions > Apps Script
 *    - Delete any default code
 *    - Copy and paste the code below into the editor
 * 
 * 4. Deploy as Web App:
 *    - Click "Deploy" > "New deployment"
 *    - Click the gear icon (⚙️) next to "Select type" and choose "Web app"
 *    - Description: "Traffic Light Experiment Webhook"
 *    - Execute as: "Me"
 *    - Who has access: "Anyone" (this allows your website to call it)
 *    - Click "Deploy"
 *    - Copy the "Web app URL" - this is your webhook URL
 * 
 * 5. Authorize the script:
 *    - When you first run it, Google will ask for permissions
 *    - Click "Review Permissions" > Choose your account > "Advanced" > "Go to [Project Name] (unsafe)" > "Allow"
 * 
 * 6. Update your website:
 *    - Open script.js
 *    - Find the CONFIG object at the top
 *    - Set googleSheetsWebhookUrl to your webhook URL from step 4
 * 
 * 7. Test:
 *    - Visit your website and interact with articles
 *    - Check your Google Sheet - data should appear automatically
 */

function doPost(e) {
  try {
    // Parse the incoming JSON data
    const data = JSON.parse(e.postData.contents);
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    
    // Ensure header row exists (only add if sheet is empty)
    if (sheet.getLastRow() === 0) {
      sheet.appendRow([
        'timestamp',
        'participantId',
        'eventType',
        'articleId',
        'trafficLightStatus',
        'misleadingScore',
        'elementType',
        'context',
        'durationMs',
        'hoverDurationMs',
        'sessionStart',
        'sessionEnd',
        'rawData'
      ]);
    }
    
    // Handle batch of events or single event
    const events = Array.isArray(data.events) ? data.events : [data];
    
    events.forEach(event => {
      // Extract event data
      const timestamp = event.timestamp || event.ts || new Date().toISOString();
      const participantId = event.participantId || event.pid || data.participantId || '';
      const eventType = event.type || event.t || '';
      const articleId = event.articleId || '';
      const trafficLightStatus = event.trafficLightStatus || '';
      const misleadingScore = event.misleadingScore || '';
      const elementType = event.elementType || '';
      const context = event.context || '';
      const durationMs = event.durationMs || '';
      const hoverDurationMs = event.hoverDurationMs || '';
      const sessionStart = event.sessionStart || '';
      const sessionEnd = event.sessionEnd || '';
      
      // Store raw JSON data for debugging/analysis
      const rawData = JSON.stringify(event);
      
      // Append row to sheet
      sheet.appendRow([
        timestamp,
        participantId,
        eventType,
        articleId,
        trafficLightStatus,
        misleadingScore,
        elementType,
        context,
        durationMs,
        hoverDurationMs,
        sessionStart,
        sessionEnd,
        rawData
      ]);
    });
    
    // Return success response (though it won't be read due to no-cors mode)
    return ContentService.createTextOutput(JSON.stringify({
      success: true,
      processed: events.length
    })).setMimeType(ContentService.MimeType.JSON);
    
  } catch (error) {
    // Log error but don't fail silently
    Logger.log('Error in doPost: ' + error.toString());
    Logger.log('Post data: ' + e.postData.contents);
    
    // Return error response
    return ContentService.createTextOutput(JSON.stringify({
      success: false,
      error: error.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

/**
 * Optional: Test function to verify the script works
 * Run this from the Apps Script editor to test
 */
function testDoPost() {
  const testData = {
    events: [{
      timestamp: new Date().toISOString(),
      participantId: 'test_participant_123',
      type: 'click',
      articleId: '1',
      trafficLightStatus: 'green',
      misleadingScore: 23,
      elementType: 'article_card',
      context: 'list'
    }]
  };
  
  const mockEvent = {
    postData: {
      contents: JSON.stringify(testData)
    }
  };
  
  const result = doPost(mockEvent);
  Logger.log('Test result: ' + result.getContent());
}

