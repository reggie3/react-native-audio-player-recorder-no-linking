import appSecrets from './appSecrets';
/*****************************************************************************/
/***************       AWS Related Utilities     *****************************/
/*****************************************************************************/

export const createAuthorizationString = (service, userInfo) => {
    // either make sure this string is on one line or strip out characters that are
    // not allowed in http headers by some APIs
    let authString = `${service}||${userInfo.accessToken}||${userInfo.id}||${userInfo.email}`;
    return authString;
}

export const convertObjectToQueryString = (obj) => {
    if (obj) {
        let queryString = "?" + Object.keys(obj).map((k) => {
            return `${encodeURIComponent(k)}=${encodeURIComponent(obj[k])}`
        }).join('&');
        return queryString;
    }
    else {
        return "";
    }
}

/***************************
 * handle error responses to requests.  successful request return a response to the calling promise
 */
export const handleErrors = (responseStatus) => {
    switch (responseStatus) {
        case 500:
            return ({
                type: 'error',
                response: 'server error'
            });
        case 403:
            return ({
                type: 'error',
                response: 'access forbidden'
            });
        default:
            return ({
                type: 'error',
                response: 'unknown error'
            });
    }
}

export const handleResponse = (response) => {
    // handleError returns a complete response with
    // with a type property already
    if (response.hasOwnProperty("type")) {
        return response;
    }
    return ({
        type: 'success',
        response
    })
}

/*****************************************************************************/
/***************       AWS Related Utilities     *****************************/
/*****************************************************************************/


export const AWSUtilities = {
    
    updateConfig: function (idToken, authType) {
        let loginsObject = {}
        switch (authType) {
            case 'Facebook':
                loginsObject = { 'graph.facebook.com': idToken }
                break;
            case 'Google':
                loginsObject = { 'accounts.google.com': idToken }
                break;
            default:
                console.error("unexpected result in 'utilities' in 'updateConfig' function");
            break;
        }
        AWS.config.update({
            region: 'us-east-1',
            credentials: new AWS.CognitoIdentityCredentials({
                IdentityPooolId: appSecrets.aws.poolID,
                Logins: loginsObject
            })
        })
    }
}

/**
 * Encode object to url parameters
 *
 * @param      {Object} paramsObj The object needs to encode as url parameters
 * @return     {String} Encoded url parameters
 */
export const objectToParams = function (paramsObj) {
    let str = '';
    for (const key in paramsObj) {
        if (str !== '') {
            str += '&';
        }
        str += `${key}=${encodeURIComponent(paramsObj[key])}`;
    }
    return str;
};

/*********
 * generate a random 5 digit number
 */
export const genRand = () => { return Math.floor(Math.random() * 89999 + 10000); }

/**************
 * Strong password generator
 */
export const generatePassword = (len) => {

    let length = (len) ? (len) : (10);
    let string = "abcdefghijklmnopqrstuvwxyz"; //to upper 
    let numeric = '0123456789';
    let punctuation = '!@#$%^&*()_+~`|}{[]\:;?><,./-=';
    let password = "";
    let character = "";
    //let crunch = true;
    while (password.length < length) {
        let entity1 = Math.ceil(string.length * Math.random() * Math.random());
        let entity2 = Math.ceil(numeric.length * Math.random() * Math.random());
        let entity3 = Math.ceil(punctuation.length * Math.random() * Math.random());
        let hold = string.charAt(entity1);
        hold = (entity1 % 2 === 0) ? (hold.toUpperCase()) : (hold);
        character += hold;
        character += numeric.charAt(entity2);
        character += punctuation.charAt(entity3);
        password = character;
    }
    return `${password}Aa1@`;
}


/************************************
 * create globally-unique identifiers to use as object names
 */
export const getGUID =() => {
  return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
    s4() + '-' + s4() + s4() + s4();
}

function s4() {
  return Math.floor((1 + Math.random()) * 0x10000)
    .toString(16)
    .substring(1);
}

export const getHashCode = (string) => {
  var hash = 0, i, chr, len;
  if (string.length === 0) return hash;
  for (i = 0, len = string.length; i < len; i++) {
    chr   = string.charCodeAt(i);
    hash  = ((hash << 5) - hash) + chr;
    hash |= 0; // Convert to 32bit integer
  }
  return hash;
};

/*************************************************
 * create an id for a story related resource item 
 * (picture, sound, locationMarker, etc.)
 */
export const getItemId = (username, itemType) =>{
    let id = itemType + "_" + getHashCode(username) + "_" + Math.floor(Date.now() / 1000);
    console.log(`${itemType} id=${id} created`);
    return id;
}

/************************************************
 * 
 */
export const syntaxHighlight = (json) => {
    json = json.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    return json.replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g, function (match) {
        var cls = 'number';
        if (/^"/.test(match)) {
            if (/:$/.test(match)) {
                cls = 'key';
            } else {
                cls = 'string';
            }
        } else if (/true|false/.test(match)) {
            cls = 'boolean';
        } else if (/null/.test(match)) {
            cls = 'null';
        }
        return '<span class="' + cls + '">' + match + '</span>';
    });
}
