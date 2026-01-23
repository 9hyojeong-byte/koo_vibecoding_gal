
/**
 * Web App Gallery - Google Apps Script Backend
 * 
 * [필독] 아래 ID들을 본인의 것으로 교체하세요!
 */
const SPREADSHEET_ID = 'YOUR_SPREADSHEET_ID'; // 실제 시트 ID로 교체 (예: 1abc123...)
const FOLDER_ID = 'YOUR_DRIVE_FOLDER_ID';      // 실제 폴더 ID로 교체 (예: 1xyz456...)
const SHEET_NAME = 'Apps';

function doGet(e) {
  try {
    const action = e.parameter.action;
    if (action === 'fetchApps') {
      return createJsonResponse(getApps());
    }
    return createJsonResponse({ success: false, message: 'Invalid GET action' });
  } catch (err) {
    return createJsonResponse({ success: false, message: 'GET Error: ' + err.toString() });
  }
}

function doPost(e) {
  try {
    if (!e.postData || !e.postData.contents) {
      return createJsonResponse({ success: false, message: '요청 데이터가 없습니다.' });
    }

    const requestData = JSON.parse(e.postData.contents);
    const action = requestData.action;
    
    // 플레이스홀더 체크
    if (SPREADSHEET_ID.indexOf('YOUR_') === 0 || FOLDER_ID.indexOf('YOUR_') === 0) {
      return createJsonResponse({ 
        success: false, 
        message: 'Code.gs 상단의 SPREADSHEET_ID와 FOLDER_ID를 본인의 것으로 설정해주세요.' 
      });
    }

    let result;
    switch(action) {
      case 'registerApp':
        result = registerApp(requestData);
        break;
      case 'updateApp':
        result = updateApp(requestData);
        break;
      case 'deleteApp':
        result = deleteApp(requestData);
        break;
      case 'verifyPassword':
        result = verifyPassword(requestData.id, requestData.password);
        break;
      default:
        result = { success: false, message: '알 수 없는 액션: ' + action };
    }
    
    return createJsonResponse(result);
  } catch (err) {
    return createJsonResponse({ success: false, message: '서버 오류: ' + err.toString() });
  }
}

function createJsonResponse(data) {
  return ContentService.createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}

function getSheet() {
  try {
    const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    let sheet = ss.getSheetByName(SHEET_NAME);
    if (!sheet) {
      sheet = ss.insertSheet(SHEET_NAME);
      sheet.appendRow(['ID', 'Name', 'Author', 'Description', 'URL', 'Images', 'Password', 'Timestamp']);
      sheet.getRange(1, 1, 1, 8).setFontWeight("bold").setBackground("#f3f3f3");
    }
    return sheet;
  } catch (e) {
    throw new Error("시트를 열 수 없습니다. ID와 권한을 확인하세요: " + e.toString());
  }
}

function registerApp(data) {
  const sheet = getSheet();
  const id = Utilities.getUuid();
  const timestamp = new Date().toISOString();
  
  // Handle image uploads
  const imageUrls = [];
  if (data.images && data.images.length > 0) {
    try {
      const folder = DriveApp.getFolderById(FOLDER_ID);
      data.images.forEach((img, index) => {
        const fileName = `${id}_${index}_${img.name}`;
        const blob = Utilities.newBlob(Utilities.base64Decode(img.base64), img.type, fileName);
        const file = folder.createFile(blob);
        file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
        
        // Direct View Link (lh3.googleusercontent.com 구조가 가장 안정적)
        const fileId = file.getId();
        const directUrl = `https://lh3.googleusercontent.com/d/${fileId}=s1600`;
        imageUrls.push(directUrl);
      });
    } catch (e) {
      return { success: false, message: '이미지 업로드 실패: ' + e.toString() };
    }
  }
  
  sheet.appendRow([
    id, 
    data.name, 
    data.author, 
    data.description, 
    data.url, 
    JSON.stringify(imageUrls), 
    String(data.password), 
    timestamp
  ]);
  
  return { success: true, id: id };
}

function getApps() {
  const sheet = getSheet();
  const data = sheet.getDataRange().getValues();
  if (data.length <= 1) return { success: true, data: [] };
  
  const apps = data.slice(1).map(row => {
    let images = [];
    try {
      images = JSON.parse(row[5] || '[]');
    } catch(e) {
      images = [];
    }
    return {
      id: row[0],
      name: row[1],
      author: row[2],
      description: row[3],
      url: row[4],
      images: images,
      timestamp: row[7]
    };
  });
  
  return { success: true, data: apps.reverse() };
}

function verifyPassword(id, password) {
  const sheet = getSheet();
  const data = sheet.getDataRange().getValues();
  for (let i = 1; i < data.length; i++) {
    if (data[i][0] === id) {
      // 숫자 비밀번호일 경우를 대비해 문자열 비교
      if (String(data[i][6]) === String(password)) {
        return { success: true };
      } else {
        return { success: false, message: '비밀번호가 일치하지 않습니다.' };
      }
    }
  }
  return { success: false, message: '해당 앱을 찾을 수 없습니다.' };
}

function updateApp(data) {
  const sheet = getSheet();
  const values = sheet.getDataRange().getValues();
  
  for (let i = 1; i < values.length; i++) {
    if (values[i][0] === data.id) {
      sheet.getRange(i + 1, 2).setValue(data.name);
      sheet.getRange(i + 1, 3).setValue(data.author);
      sheet.getRange(i + 1, 4).setValue(data.description);
      sheet.getRange(i + 1, 5).setValue(data.url);
      return { success: true };
    }
  }
  return { success: false, message: '수정할 앱을 찾을 수 없습니다.' };
}

function deleteApp(data) {
  const verification = verifyPassword(data.id, data.password);
  if (!verification.success) return verification;
  
  const sheet = getSheet();
  const values = sheet.getDataRange().getValues();
  
  for (let i = 1; i < values.length; i++) {
    if (values[i][0] === data.id) {
      sheet.deleteRow(i + 1);
      return { success: true };
    }
  }
  return { success: false, message: '삭제할 앱을 찾을 수 없습니다.' };
}
