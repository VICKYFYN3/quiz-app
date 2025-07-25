function doPost(e) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  var data = JSON.parse(e.postData.contents);
  if (data.checkMatric && data.matric) {
    var values = sheet.getDataRange().getValues();
    var exists = values.some(function(row) {
      return row[1] && row[1].toString().trim() === data.matric.toString().trim();
    });
    return ContentService.createTextOutput(
      JSON.stringify({ exists: exists })
    ).setMimeType(ContentService.MimeType.JSON);
  }
  sheet.appendRow([data.name, data.matric, data.department, data.score]);
  return ContentService.createTextOutput(
    JSON.stringify({ result: "success" })
  ).setMimeType(ContentService.MimeType.JSON);
} 