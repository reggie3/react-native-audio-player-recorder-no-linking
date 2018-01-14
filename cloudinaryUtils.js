import appSecrets from './appSecrets';
import {
  createAuthorizationString,
  convertObjectToQueryString,
  handleErrors,
  handleResponse
} from './utilities';
const FormData = require('form-data');

const CLOUDINARY_URL = appSecrets.cloudinary.API_URL;
const AWS_URL = appSecrets.aws.devEndpoint;
const CLOUDINARY_API_KEY = appSecrets.cloudinary.API_KEY;

// global variable to hold the callback
let uploadCallback = null;

const getSignatures = (service, userInfo, uploadItems) => {
  return fetch(AWS_URL + 'cloudinarysignature', {
    method: 'POST',
    headers: {
      Auth: createAuthorizationString(service, userInfo),
      Accept: 'application/json'
    },
    body: JSON.stringify({
      uploadItems
    })
  })
    .then(response => {
      if (response.status !== 200) {
        return handleErrors(response.status);
      } else {
        return response.json();
      }
    })
    .then(response => {
      return handleResponse(response);
    })
    .catch(function(err) {
      console.log('Error: ', err);
    });
};

const uploadFiles = async function(signatureInfo, files, path) {
  // create an array of information for each file
  let filesInfoWithSignature = files.map(file => {
    return Object.assign({}, file, {
      signature: signatureInfo[file.fileID].signature,
      timeStamp: signatureInfo[file.fileID].timeStamp,
      publicID: signatureInfo[file.fileID].publicID,
      path
    });
  });

  // step through that array and upload each file
  let promiseAllResponse = await Promise.all(
    filesInfoWithSignature.map(async function(fileInfo) {
      // build the FormData object
      formData = new FormData();
      formData.append('api_key', CLOUDINARY_API_KEY);
      formData.append('file', fileInfo.base64);
      formData.append('timestamp', fileInfo.timeStamp);
      formData.append('signature', fileInfo.signature);
      formData.append('public_id', fileInfo.publicID);
      const response = await fetch(CLOUDINARY_URL + `/upload`, {
        method: 'POST',
        body: formData,
        headers: {
          Accept: 'application/json'
        }
      });

      uploadCallback('FILE_UPLOADED', fileInfo.fileID);

      return {
        response,
        fileID: fileInfo.fileID
      };
    })
  );
  return promiseAllResponse;
};

export const cloudinaryUpload = async function(config, loginInfo, publishOrSave) {
  // assign the passed callback to a global variable
  uploadCallback = config.statusCallback;
  uploadCallback('UPLOAD_PENDING');

  let results = {
    numberFiles: config.fileNames.length,
    fullSuccess: true,
    numSuccess: 0,
    numFailures: 0,
    successFileIDs: [],
    failureFileIDs: []
  };

  // build the public IDs that cloudinary will use
  let filesInfo = config.fileNames.map(fileName => {
    return {
      publicID:
        (config.hasOwnProperty('prefix') ? config.prefix + '-' : '') +
        fileName +
        (config.hasOwnProperty('suffix') ? '-' + config.suffix : ''),
      ID: fileName
    };
  });

  // get the signatures so that the file(s) can be uploaded
  const getSignaturesResponse = await getSignatures(
    loginInfo.loginType,
    loginInfo.userInfo,
    filesInfo
  );

  const uploadFileResponse = await uploadFiles(
    getSignaturesResponse.response,
    config.files,
    config.path
  );

  // build an object to return to the calling function
  uploadFileResponse.forEach(res => {
    if (res.response.ok) {
      results.numSuccess++;
      results.successFileIDs.push(res.fileID);
    } else {
      results.numFailures++;
      results.failureFileIDs.push(res.fileID);
    }
  });
  if (results.numberFiles !== results.numSuccess) {
    results.fullSuccess = false;
  }
  return {results, publishOrSave};
};


const uploadFilesByURI = async function(signatureInfo, files, path) {
  // create an array of information for each file
  let filesInfoWithSignature = files.map(file => {
    return Object.assign({}, file, {
      signature: signatureInfo[file.fileID].signature,
      timeStamp: signatureInfo[file.fileID].timeStamp,
      publicID: signatureInfo[file.fileID].publicID,
      path
    });
  });

  // step through that array and upload each file
  let promiseAllResponse = await Promise.all(
    filesInfoWithSignature.map(async function(fileInfo) {
      // build the FormData object
      debugger;
      formData = new FormData();
      formData.append('api_key', CLOUDINARY_API_KEY);
      formData.append('file', fileInfo.URI);
      formData.append('uri', fileInfo.URI);
      formData.append('timestamp', fileInfo.timeStamp);
      formData.append('signature', fileInfo.signature);
      formData.append('public_id', fileInfo.publicID);
      const response = await fetch(CLOUDINARY_URL + `/upload`, {
        method: 'POST',
        body: formData,
        headers: {
          Accept: 'application/json'
        }
      });

      uploadCallback('FILE_UPLOADED', fileInfo.fileID);

      return {
        response,
        fileID: fileInfo.fileID
      };
    })
  );
  return promiseAllResponse;
};

export const cloudinaryUploadByURI = async function(config, loginInfo, publishOrSave) {
  // assign the passed callback to a global variable
  uploadCallback = config.statusCallback;
  uploadCallback('UPLOAD_PENDING');

  let results = {
    numberFiles: config.fileNames.length,
    fullSuccess: true,
    numSuccess: 0,
    numFailures: 0,
    successFileIDs: [],
    failureFileIDs: []
  };

  // build the public IDs that cloudinary will use
  let filesInfo = config.fileNames.map(fileName => {
    return {
      publicID:
        (config.hasOwnProperty('prefix') ? config.prefix + '-' : '') +
        fileName +
        (config.hasOwnProperty('suffix') ? '-' + config.suffix : ''),
      ID: fileName
    };
  });

  // get the signatures so that the file(s) can be uploaded
  const getSignaturesResponse = await getSignatures(
    loginInfo.loginType,
    loginInfo.userInfo,
    filesInfo
  );

  const uploadFileResponse = await uploadFilesByURI(
    getSignaturesResponse.response,
    config.files,
    config.path
  );

  // build an object to return to the calling function
  uploadFileResponse.forEach(res => {
    if (res.response.ok) {
      results.numSuccess++;
      results.successFileIDs.push(res.fileID);
    } else {
      results.numFailures++;
      results.failureFileIDs.push(res.fileID);
    }
  });
  if (results.numberFiles !== results.numSuccess) {
    results.fullSuccess = false;
  }
  return {results, publishOrSave};
};

export const cloudinaryDownload=()=>{}